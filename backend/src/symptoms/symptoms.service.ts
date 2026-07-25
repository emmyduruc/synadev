import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type {
  ReplaceSymptomLogs,
  SymptomCatalog,
  SymptomId,
  SymptomLogMap,
  SymptomLogs,
} from '@syna/shared-types';
import { DataSource, Repository } from 'typeorm';

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

  async getCatalog(): Promise<SymptomCatalog> {
    const categories = await this.symptomCategoriesRepository.find({
      order: { sortOrder: 'ASC' },
    });
    const symptoms = await this.symptomsRepository.find({
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
      logs[dateKey] = [...existing, row.symptomId as SymptomId];
    }

    return { logs };
  }

  async replaceLogs(
    clerkUser: AuthenticatedClerkUser,
    input: ReplaceSymptomLogs,
  ): Promise<SymptomLogs> {
    const userId = await this.usersService.resolveUserId(clerkUser);

    const cleaned: SymptomLogMap = {};

    for (const [logDate, ids] of Object.entries(input.logs)) {
      const unique = [...new Set(ids)];

      if (unique.length > 0) {
        cleaned[logDate] = unique;
      }
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.delete(SymptomEntryEntity, { userId });

      const rows: SymptomEntryEntity[] = [];

      for (const [logDate, ids] of Object.entries(cleaned)) {
        for (const symptomId of ids) {
          rows.push(manager.create(SymptomEntryEntity, { userId, logDate, symptomId }));
        }
      }

      if (rows.length > 0) {
        await manager.save(rows);
      }
    });

    return { logs: cleaned };
  }
}
