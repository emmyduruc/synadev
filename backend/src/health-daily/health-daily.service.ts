import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  HEALTH_DAILY_MAX_RANGE_DAYS,
  type GetHealthDailyMetricsQuery,
  type HealthDailyMetrics,
  type UpsertHealthDailyMetrics,
} from '@syna/shared-types';
import { Repository } from 'typeorm';

import type { AuthenticatedClerkUser } from '../auth/auth.types';
import { UsersService } from '../users/users.service';

import { HealthDailyMetricEntity } from './health-daily-metric.entity';

const toDateKey = (value: string | Date): string => {
  if (typeof value === 'string') {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
};

const daysBetweenInclusive = (fromDateKey: string, toDateKey: string): number => {
  const from = new Date(`${fromDateKey}T12:00:00Z`).getTime();
  const to = new Date(`${toDateKey}T12:00:00Z`).getTime();
  return Math.round((to - from) / 86_400_000) + 1;
};

@Injectable()
export class HealthDailyService {
  constructor(
    @InjectRepository(HealthDailyMetricEntity)
    private readonly healthDailyRepository: Repository<HealthDailyMetricEntity>,
    private readonly usersService: UsersService,
  ) {}

  async listDaily(
    clerkUser: AuthenticatedClerkUser,
    query: GetHealthDailyMetricsQuery,
  ): Promise<HealthDailyMetrics> {
    if (query.from > query.to) {
      throw new BadRequestException('from must be on or before to');
    }

    const rangeDays = daysBetweenInclusive(query.from, query.to);

    if (rangeDays > HEALTH_DAILY_MAX_RANGE_DAYS) {
      throw new BadRequestException(
        `Range cannot exceed ${HEALTH_DAILY_MAX_RANGE_DAYS} days`,
      );
    }

    const userId = await this.usersService.resolveUserId(clerkUser);
    const rows = await this.healthDailyRepository
      .createQueryBuilder('row')
      .where('row.user_id = :userId', { userId })
      .andWhere('row.log_date >= :from', { from: query.from })
      .andWhere('row.log_date <= :to', { to: query.to })
      .orderBy('row.log_date', 'ASC')
      .getMany();

    const platform = rows[0]?.platform ?? 'unsupported';

    return {
      platform,
      rows: rows.map((row) => ({
        dateKey: toDateKey(row.logDate),
        metrics: row.metrics,
      })),
    };
  }

  async upsertDaily(
    clerkUser: AuthenticatedClerkUser,
    input: UpsertHealthDailyMetrics,
  ): Promise<HealthDailyMetrics> {
    const userId = await this.usersService.resolveUserId(clerkUser);
    const syncedAt = new Date();

    const byDate = new Map<string, (typeof input.rows)[number]>();

    for (const row of input.rows) {
      byDate.set(row.dateKey, row);
    }

    const uniqueRows = [...byDate.values()].sort((a, b) =>
      a.dateKey.localeCompare(b.dateKey),
    );

    for (const row of uniqueRows) {
      await this.healthDailyRepository.save({
        userId,
        logDate: row.dateKey,
        platform: input.platform,
        metrics: row.metrics,
        syncedAt,
      });
    }

    if (uniqueRows.length === 0) {
      return { platform: input.platform, rows: [] };
    }

    const from = uniqueRows[0].dateKey;
    const to = uniqueRows[uniqueRows.length - 1].dateKey;

    return this.listDaily(clerkUser, { from, to });
  }
}
