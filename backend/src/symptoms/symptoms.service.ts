import { randomBytes } from 'node:crypto';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type {
  CreateCustomSymptom,
  CustomSymptom,
  CustomSymptoms,
  ReplaceSymptomFavorites,
  ReplaceSymptomLogs,
  SymptomCatalog,
  SymptomDayEntry,
  SymptomFavorites,
  SymptomId,
  SymptomLogMap,
  SymptomLogs,
} from '@syna/shared-types';
import { CUSTOM_SYMPTOM_ID_PREFIX, isCustomSymptomId, isSymptomId } from '@syna/shared-types';
import { DataSource, IsNull, Repository } from 'typeorm';

import type { AuthenticatedClerkUser } from '../auth/auth.types';
import { UsersService } from '../users/users.service';

import { SymptomCategoryEntity } from './symptom-category.entity';
import { SymptomEntryEntity } from './symptom-entry.entity';
import { SymptomEntity } from './symptom.entity';

const toDateKey = (value: string | Date): string => {
  if (typeof value === 'string') {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
};

const clampIntensity = (value: number | null | undefined): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 2;
  }

  if (value < 0) {
    return 0;
  }

  if (value > 4) {
    return 4;
  }

  return Math.trunc(value);
};

const createCustomSymptomId = (): string =>
  `${CUSTOM_SYMPTOM_ID_PREFIX}${randomBytes(8).toString('hex')}`;

@Injectable()
export class SymptomsService {
  constructor(
    @InjectRepository(SymptomEntryEntity)
    private readonly symptomEntriesRepository: Repository<SymptomEntryEntity>,
    @InjectRepository(SymptomCategoryEntity)
    private readonly symptomCategoriesRepository: Repository<SymptomCategoryEntity>,
    @InjectRepository(SymptomEntity)
    private readonly symptomsRepository: Repository<SymptomEntity>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async getCatalog(clerkUser?: AuthenticatedClerkUser): Promise<SymptomCatalog> {
    const categories = await this.symptomCategoriesRepository.find({
      order: { sortOrder: 'ASC' },
    });

    const userId = clerkUser
      ? await this.usersService.resolveUserId(clerkUser)
      : null;

    const symptoms = await this.symptomsRepository.find({
      where: userId
        ? [{ userId: IsNull() }, { userId }]
        : { userId: IsNull() },
      order: { sortOrder: 'ASC' },
    });

    return {
      categories: categories.map((category) => ({
        id: category.id as SymptomCatalog['categories'][number]['id'],
        sortOrder: category.sortOrder,
        symptoms: symptoms
          .filter((symptom) => symptom.categoryId === category.id)
          .map((symptom) => ({
            id: symptom.id as SymptomId,
            categoryId: symptom.categoryId as SymptomCatalog['categories'][number]['id'],
            sortOrder: symptom.sortOrder,
          })),
      })),
    };
  }

  async listCustomSymptoms(clerkUser: AuthenticatedClerkUser): Promise<CustomSymptoms> {
    const userId = await this.usersService.resolveUserId(clerkUser);
    const rows = await this.symptomsRepository.find({
      where: { userId },
      order: { sortOrder: 'ASC', id: 'ASC' },
    });

    return {
      symptoms: rows
        .filter((row) => isCustomSymptomId(row.id) && Boolean(row.label))
        .map((row) => ({
          id: row.id as SymptomId,
          label: row.label as string,
          categoryId: row.categoryId as CustomSymptom['categoryId'],
        })),
    };
  }

  async createCustomSymptom(
    clerkUser: AuthenticatedClerkUser,
    input: CreateCustomSymptom,
  ): Promise<CustomSymptom> {
    const userId = await this.usersService.resolveUserId(clerkUser);
    const id = createCustomSymptomId();
    const label = input.label.trim();

    const row = this.symptomsRepository.create({
      id,
      userId,
      label,
      categoryId: input.categoryId,
      sortOrder: 100,
    });

    await this.symptomsRepository.save(row);

    return {
      id: row.id as SymptomId,
      label,
      categoryId: row.categoryId as CustomSymptom['categoryId'],
    };
  }

  async listLogs(clerkUser: AuthenticatedClerkUser): Promise<SymptomLogs> {
    const userId = await this.usersService.resolveUserId(clerkUser);
    const rows = await this.symptomEntriesRepository.find({
      where: { userId },
      order: { logDate: 'ASC', symptomId: 'ASC' },
    });

    const logs: SymptomLogMap = {};

    for (const row of rows) {
      const dateKey = toDateKey(row.logDate);
      const existing = logs[dateKey] ?? [];
      const entry: SymptomDayEntry = {
        symptomId: row.symptomId as SymptomId,
        intensity: clampIntensity(row.intensity),
        ...(row.extras ? { extras: row.extras } : {}),
      };
      logs[dateKey] = [...existing, entry];
    }

    return { logs };
  }

  async replaceLogs(
    clerkUser: AuthenticatedClerkUser,
    input: ReplaceSymptomLogs,
  ): Promise<SymptomLogs> {
    const userId = await this.usersService.resolveUserId(clerkUser);

    const cleaned: SymptomLogMap = {};

    for (const [logDate, entries] of Object.entries(input.logs)) {
      const byId = new Map<SymptomId, SymptomDayEntry>();

      for (const entry of entries) {
        byId.set(entry.symptomId, {
          symptomId: entry.symptomId,
          intensity: clampIntensity(entry.intensity),
          ...(entry.extras && Object.keys(entry.extras).length > 0
            ? { extras: entry.extras }
            : {}),
        });
      }

      if (byId.size > 0) {
        cleaned[logDate] = [...byId.values()];
      }
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.delete(SymptomEntryEntity, { userId });

      const rows: SymptomEntryEntity[] = [];

      for (const [logDate, entries] of Object.entries(cleaned)) {
        for (const entry of entries) {
          rows.push(
            manager.create(SymptomEntryEntity, {
              userId,
              logDate,
              symptomId: entry.symptomId,
              intensity: entry.intensity,
              extras: entry.extras ?? null,
            }),
          );
        }
      }

      if (rows.length > 0) {
        await manager.save(rows);
      }
    });

    return { logs: cleaned };
  }

  async listFavorites(clerkUser: AuthenticatedClerkUser): Promise<SymptomFavorites> {
    const ids = await this.usersService.getFavoriteSymptomIds(clerkUser);

    return {
      symptomIds: ids.filter((id): id is SymptomId => isSymptomId(id)),
    };
  }

  async replaceFavorites(
    clerkUser: AuthenticatedClerkUser,
    input: ReplaceSymptomFavorites,
  ): Promise<SymptomFavorites> {
    const uniqueIds = [...new Set(input.symptomIds)];
    const saved = await this.usersService.replaceFavoriteSymptomIds(clerkUser, uniqueIds);

    return {
      symptomIds: saved.filter((id): id is SymptomId => isSymptomId(id)),
    };
  }
}
