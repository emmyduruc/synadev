import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  createEmptyReportPreferences,
  type ReportPreferences,
  type UpdateReportPreferences,
} from '@syna/shared-types';
import { DataSource, Repository } from 'typeorm';

import type { AuthenticatedClerkUser } from '../auth/auth.types';
import { UsersService } from '../users/users.service';

import { UserReportConcernSelectionEntity } from './user-report-concern-selection.entity';
import { UserReportCustomDoctorQuestionEntity } from './user-report-custom-doctor-question.entity';
import { UserReportDoctorQuestionSelectionEntity } from './user-report-doctor-question-selection.entity';
import { UserReportPreferencesEntity } from './user-report-preferences.entity';

const toDateKey = (value: string | Date | null | undefined): string | null => {
  if (value === null) {
    return null;
  }

  if (typeof value === 'string') {
    return value.slice(0, 10);
  }

  return value?.toISOString().slice(0, 10) ?? null;
};

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(UserReportPreferencesEntity)
    private readonly preferencesRepository: Repository<UserReportPreferencesEntity>,
    @InjectRepository(UserReportDoctorQuestionSelectionEntity)
    private readonly doctorQuestionRepository: Repository<UserReportDoctorQuestionSelectionEntity>,
    @InjectRepository(UserReportCustomDoctorQuestionEntity)
    private readonly customQuestionRepository: Repository<UserReportCustomDoctorQuestionEntity>,
    @InjectRepository(UserReportConcernSelectionEntity)
    private readonly concernRepository: Repository<UserReportConcernSelectionEntity>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async getPreferences(
    clerkUser: AuthenticatedClerkUser,
  ): Promise<ReportPreferences> {
    const userId = await this.usersService.resolveUserId(clerkUser);
    return this.loadPreferences(userId);
  }

  async replacePreferences(
    clerkUser: AuthenticatedClerkUser,
    input: UpdateReportPreferences,
  ): Promise<ReportPreferences> {
    const userId = await this.usersService.resolveUserId(clerkUser);

    await this.dataSource.transaction(async (manager) => {
      await manager.delete(UserReportDoctorQuestionSelectionEntity, { userId });
      await manager.delete(UserReportCustomDoctorQuestionEntity, { userId });
      await manager.delete(UserReportConcernSelectionEntity, { userId });

      const trimmedFreeText = input.concernFreeText?.trim() || null;

      await manager.save(
        UserReportPreferencesEntity,
        manager.create(UserReportPreferencesEntity, {
          userId,
          periodPreset: input.periodPreset,
          periodFromDate: input.periodFromDate,
          periodToDate: input.periodToDate,
          concernFreeText: trimmedFreeText,
        }),
      );

      if (input.doctorQuestionIds.length > 0) {
        await manager.save(
          UserReportDoctorQuestionSelectionEntity,
          input.doctorQuestionIds.map((questionId, index) =>
            manager.create(UserReportDoctorQuestionSelectionEntity, {
              userId,
              questionId,
              sortOrder: index,
            }),
          ),
        );
      }

      if (input.customDoctorQuestions.length > 0) {
        await manager.save(
          UserReportCustomDoctorQuestionEntity,
          input.customDoctorQuestions.map((questionText, index) =>
            manager.create(UserReportCustomDoctorQuestionEntity, {
              userId,
              questionText,
              sortOrder: index,
            }),
          ),
        );
      }

      if (input.concernIds.length > 0) {
        await manager.save(
          UserReportConcernSelectionEntity,
          input.concernIds.map((concernId, index) =>
            manager.create(UserReportConcernSelectionEntity, {
              userId,
              concernId,
              sortOrder: index,
            }),
          ),
        );
      }
    });

    return this.loadPreferences(userId);
  }

  private async loadPreferences(userId: string): Promise<ReportPreferences> {
    const preferences = await this.preferencesRepository.findOne({
      where: { userId },
    });

    if (!preferences) {
      return createEmptyReportPreferences();
    }

    const [doctorQuestions, customQuestions, concerns] = await Promise.all([
      this.doctorQuestionRepository.find({
        where: { userId },
        order: { sortOrder: 'ASC' },
      }),
      this.customQuestionRepository.find({
        where: { userId },
        order: { sortOrder: 'ASC' },
      }),
      this.concernRepository.find({
        where: { userId },
        order: { sortOrder: 'ASC' },
      }),
    ]);

    return {
      periodPreset: preferences.periodPreset as ReportPreferences['periodPreset'],
      periodFromDate: toDateKey(preferences.periodFromDate),
      periodToDate: toDateKey(preferences.periodToDate),
      doctorQuestionIds: doctorQuestions.map(
        (row) => row.questionId as ReportPreferences['doctorQuestionIds'][number],
      ),
      customDoctorQuestions: customQuestions.map((row) => row.questionText),
      concernIds: concerns.map(
        (row) => row.concernId as ReportPreferences['concernIds'][number],
      ),
      concernFreeText: preferences.concernFreeText,
    };
  }
}
