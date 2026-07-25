import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { PeriodDays, ReplacePeriodDays } from '@syna/shared-types';
import { DataSource, Repository } from 'typeorm';

import type { AuthenticatedClerkUser } from '../auth/auth.types';
import { UsersService } from '../users/users.service';

import { PeriodDayEntity } from './period-day.entity';

const toDateKey = (value: string | Date): string => {
  if (typeof value === 'string') {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
};

@Injectable()
export class PeriodService {
  constructor(
    @InjectRepository(PeriodDayEntity)
    private readonly periodDaysRepository: Repository<PeriodDayEntity>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async listDays(clerkUser: AuthenticatedClerkUser): Promise<PeriodDays> {
    const userId = await this.usersService.resolveUserId(clerkUser);
    const rows = await this.periodDaysRepository.find({
      where: { userId },
      order: { logDate: 'ASC' },
    });

    return {
      dateKeys: rows.map((row) => toDateKey(row.logDate)),
    };
  }

  async replaceDays(
    clerkUser: AuthenticatedClerkUser,
    input: ReplacePeriodDays,
  ): Promise<PeriodDays> {
    const userId = await this.usersService.resolveUserId(clerkUser);
    const uniqueSorted = [...new Set(input.dateKeys)].sort();

    await this.dataSource.transaction(async (manager) => {
      await manager.delete(PeriodDayEntity, { userId });

      if (uniqueSorted.length === 0) {
        return;
      }

      const rows = uniqueSorted.map((logDate) =>
        manager.create(PeriodDayEntity, { userId, logDate }),
      );
      await manager.save(rows);
    });

    return { dateKeys: uniqueSorted };
  }
}
