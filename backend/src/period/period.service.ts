import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { PeriodDay, PeriodDays, ReplacePeriodDays } from '@syna/shared-types';
import { createEmptyPeriodDay } from '@syna/shared-types';
import { DataSource, Repository } from 'typeorm';

import type { AuthenticatedClerkUser } from '../auth/auth.types';
import { CycleService } from '../cycle/cycle.service';
import { UsersService } from '../users/users.service';

import { PeriodDayEntity } from './period-day.entity';

const toDateKey = (value: string | Date): string => {
  if (typeof value === 'string') {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
};

const toPeriodDay = (row: PeriodDayEntity): PeriodDay => ({
  dateKey: toDateKey(row.logDate),
  isFirstDay: row.isFirstDay ?? null,
  bleedingType: row.bleedingType ?? null,
  strength: row.strength ?? null,
  observations: row.observations ?? [],
  notes: row.notes ?? null,
});

const resolveNextDays = (
  input: ReplacePeriodDays,
  existingByDate: Map<string, PeriodDay>,
): PeriodDay[] => {
  if (input.days !== undefined) {
    const byDate = new Map<string, PeriodDay>();

    for (const day of input.days) {
      byDate.set(day.dateKey, {
        ...createEmptyPeriodDay(day.dateKey),
        ...day,
        observations: day.observations ?? [],
      });
    }

    return [...byDate.values()].sort((a, b) =>
      a.dateKey.localeCompare(b.dateKey),
    );
  }

  if (input.dateKeys === undefined) {
    throw new BadRequestException('Provide days or dateKeys');
  }

  const dateKeys = [...new Set(input.dateKeys)].sort();

  return dateKeys.map((dateKey) => {
    const existing = existingByDate.get(dateKey);
    return existing ?? createEmptyPeriodDay(dateKey);
  });
};

@Injectable()
export class PeriodService {
  constructor(
    @InjectRepository(PeriodDayEntity)
    private readonly periodDaysRepository: Repository<PeriodDayEntity>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
    private readonly cycleService: CycleService,
  ) {}

  async listDays(clerkUser: AuthenticatedClerkUser): Promise<PeriodDays> {
    const userId = await this.usersService.resolveUserId(clerkUser);
    const rows = await this.periodDaysRepository.find({
      where: { userId },
      order: { logDate: 'ASC' },
    });

    const days = rows.map(toPeriodDay);

    return {
      dateKeys: days.map((day) => day.dateKey),
      days,
    };
  }

  async replaceDays(
    clerkUser: AuthenticatedClerkUser,
    input: ReplacePeriodDays,
  ): Promise<PeriodDays> {
    const userId = await this.usersService.resolveUserId(clerkUser);
    const existingRows = await this.periodDaysRepository.find({
      where: { userId },
    });
    const existingByDate = new Map(
      existingRows.map((row) => [toDateKey(row.logDate), toPeriodDay(row)]),
    );
    const nextDays = resolveNextDays(input, existingByDate);

    await this.dataSource.transaction(async (manager) => {
      await manager.delete(PeriodDayEntity, { userId });

      if (nextDays.length === 0) {
        return;
      }

      const rows = nextDays.map((day) =>
        manager.create(PeriodDayEntity, {
          userId,
          logDate: day.dateKey,
          isFirstDay: day.isFirstDay,
          bleedingType: day.bleedingType,
          strength: day.strength,
          observations: day.observations,
          notes: day.notes,
        }),
      );
      await manager.save(rows);
    });

    await this.cycleService.syncUserPhase(userId);

    return {
      dateKeys: nextDays.map((day) => day.dateKey),
      days: nextDays,
    };
  }
}
