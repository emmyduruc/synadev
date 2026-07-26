import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import type { CyclePhaseSnapshotDto } from '@syna/shared-types';
import { calculateCyclePhase } from '@syna/shared-utils';
import { Repository } from 'typeorm';

import type { AuthenticatedClerkUser } from '../auth/auth.types';
import { CycleNotificationService } from '../notifications/cycle-notification.service';
import { PeriodDayEntity } from '../period/period-day.entity';
import { UsersService } from '../users/users.service';

import { UserCycleStateEntity } from './user-cycle-state.entity';

const toDateKey = (value: string | Date): string => {
  if (typeof value === 'string') {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
};

const todayUtcDateKey = (): string => new Date().toISOString().slice(0, 10);

@Injectable()
export class CycleService {
  private readonly logger = new Logger(CycleService.name);

  constructor(
    @InjectRepository(PeriodDayEntity)
    private readonly periodDaysRepository: Repository<PeriodDayEntity>,
    @InjectRepository(UserCycleStateEntity)
    private readonly cycleStateRepository: Repository<UserCycleStateEntity>,
    private readonly usersService: UsersService,
    private readonly cycleNotificationService: CycleNotificationService,
  ) {}

  async getPhaseForClerkUser(
    clerkUser: AuthenticatedClerkUser,
    asOfDateKey = todayUtcDateKey(),
  ): Promise<CyclePhaseSnapshotDto> {
    const userId = await this.usersService.resolveUserId(clerkUser);
    return this.syncUserPhase(userId, asOfDateKey);
  }

  async syncUserPhase(
    userId: string,
    asOfDateKey = todayUtcDateKey(),
  ): Promise<CyclePhaseSnapshotDto> {
    const rows = await this.periodDaysRepository.find({
      where: { userId },
      order: { logDate: 'ASC' },
    });

    const periodDateKeys = rows.map((row) => toDateKey(row.logDate));
    const computed = calculateCyclePhase({ periodDateKeys, asOfDateKey });

    const snapshot: CyclePhaseSnapshotDto = {
      phase: computed.phase,
      cycleDay: computed.cycleDay,
      cycleLengthDays: computed.cycleLengthDays,
      periodLengthDays: computed.periodLengthDays,
      ovulationDay: computed.ovulationDay,
      periodStartDateKey: computed.periodStartDateKey,
      nextPeriodDateKey: computed.nextPeriodDateKey,
      hasPeriodData: computed.hasPeriodData,
      asOfDateKey,
    };

    let state = await this.cycleStateRepository.findOne({ where: { userId } });

    if (!state) {
      state = this.cycleStateRepository.create({ userId });
    }

    const previousPhase = state.currentPhase;

    state.currentPhase = snapshot.phase;
    state.cycleDay = snapshot.cycleDay;
    state.periodStartDate = snapshot.periodStartDateKey;
    state.nextPeriodDate = snapshot.nextPeriodDateKey;
    state.cycleLengthDays = snapshot.cycleLengthDays;
    state.periodLengthDays = snapshot.periodLengthDays;

    await this.cycleStateRepository.save(state);

    if (snapshot.phase === null) {
      return snapshot;
    }

    // First observation: baseline without notifying.
    if (previousPhase === null) {
      state.notifiedPhase = snapshot.phase;
      state.notifiedAt = new Date();
      await this.cycleStateRepository.save(state);
      return snapshot;
    }

    // Phase transition: email + push.
    if (snapshot.phase !== previousPhase) {
      try {
        await this.cycleNotificationService.notifyPhaseChange(userId, snapshot);
        state.notifiedPhase = snapshot.phase;
        state.notifiedAt = new Date();
        await this.cycleStateRepository.save(state);
      } catch (error) {
        this.logger.warn(
          `Failed to notify cycle phase for user ${userId}: ${
            error instanceof Error ? error.message : 'unknown error'
          }`,
        );
      }
    }

    return snapshot;
  }

  async syncAllUsers(asOfDateKey = todayUtcDateKey()): Promise<number> {
    const userIds = await this.periodDaysRepository
      .createQueryBuilder('period')
      .select('DISTINCT period.user_id', 'userId')
      .getRawMany<{ userId: string }>();

    let synced = 0;

    for (const row of userIds) {
      await this.syncUserPhase(row.userId, asOfDateKey);
      synced += 1;
    }

    return synced;
  }

  /** Daily UTC morning sync — detects day-boundary phase transitions. */
  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async syncAllCyclePhasesCron(): Promise<void> {
    const synced = await this.syncAllUsers();
    this.logger.log(`Cycle phase daily sync complete (${synced} users)`);
  }
}
