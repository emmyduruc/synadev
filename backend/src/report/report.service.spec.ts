import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createEmptyReportPreferences } from '@syna/shared-types';
import { DataSource } from 'typeorm';

import type { AuthenticatedClerkUser } from '../auth/auth.types';
import { UsersService } from '../users/users.service';

import { ReportService } from './report.service';
import { UserReportConcernSelectionEntity } from './user-report-concern-selection.entity';
import { UserReportCustomDoctorQuestionEntity } from './user-report-custom-doctor-question.entity';
import { UserReportDoctorQuestionSelectionEntity } from './user-report-doctor-question-selection.entity';
import { UserReportPreferencesEntity } from './user-report-preferences.entity';

const clerkUser: AuthenticatedClerkUser = {
  clerkId: 'clerk_test',
  email: 'test@example.com',
};

describe('ReportService', () => {
  let service: ReportService;
  let preferencesFindOne: jest.Mock;
  let doctorFind: jest.Mock;
  let customFind: jest.Mock;
  let concernFind: jest.Mock;
  let transaction: jest.Mock;

  beforeEach(async () => {
    preferencesFindOne = jest.fn().mockResolvedValue(null);
    doctorFind = jest.fn().mockResolvedValue([]);
    customFind = jest.fn().mockResolvedValue([]);
    concernFind = jest.fn().mockResolvedValue([]);
    transaction = jest.fn(async (callback: (manager: unknown) => Promise<void>) => {
      const manager = {
        delete: jest.fn().mockResolvedValue(undefined),
        create: jest.fn((_entity: unknown, data: unknown) => data),
        save: jest.fn().mockResolvedValue(undefined),
      };
      await callback(manager);
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: getRepositoryToken(UserReportPreferencesEntity),
          useValue: { findOne: preferencesFindOne },
        },
        {
          provide: getRepositoryToken(UserReportDoctorQuestionSelectionEntity),
          useValue: { find: doctorFind },
        },
        {
          provide: getRepositoryToken(UserReportCustomDoctorQuestionEntity),
          useValue: { find: customFind },
        },
        {
          provide: getRepositoryToken(UserReportConcernSelectionEntity),
          useValue: { find: concernFind },
        },
        {
          provide: UsersService,
          useValue: {
            resolveUserId: jest.fn().mockResolvedValue('user-1'),
          },
        },
        {
          provide: DataSource,
          useValue: { transaction },
        },
      ],
    }).compile();

    service = module.get(ReportService);
  });

  it('returns empty preferences when no row exists', async () => {
    await expect(service.getPreferences(clerkUser)).resolves.toEqual(
      createEmptyReportPreferences(),
    );
  });

  it('replaces preferences in a transaction and returns loaded snapshot', async () => {
    preferencesFindOne.mockResolvedValue({
      userId: 'user-1',
      periodPreset: 'days_28',
      periodFromDate: '2026-09-01',
      periodToDate: '2026-09-28',
      concernFreeText: 'Extra note',
    });
    doctorFind.mockResolvedValue([
      { questionId: 'blood_pressure', sortOrder: 0 },
    ]);
    customFind.mockResolvedValue([{ questionText: 'Custom Q', sortOrder: 0 }]);
    concernFind.mockResolvedValue([
      { concernId: 'taken_seriously', sortOrder: 0 },
    ]);

    const result = await service.replacePreferences(clerkUser, {
      periodPreset: 'days_28',
      periodFromDate: '2026-09-01',
      periodToDate: '2026-09-28',
      doctorQuestionIds: ['blood_pressure'],
      customDoctorQuestions: ['Custom Q'],
      concernIds: ['taken_seriously'],
      concernFreeText: 'Extra note',
    });

    expect(transaction).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      periodPreset: 'days_28',
      periodFromDate: '2026-09-01',
      periodToDate: '2026-09-28',
      doctorQuestionIds: ['blood_pressure'],
      customDoctorQuestions: ['Custom Q'],
      concernIds: ['taken_seriously'],
      concernFreeText: 'Extra note',
    });
  });
});
