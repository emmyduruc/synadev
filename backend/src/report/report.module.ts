import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { UserReportConcernSelectionEntity } from './user-report-concern-selection.entity';
import { UserReportCustomDoctorQuestionEntity } from './user-report-custom-doctor-question.entity';
import { UserReportDoctorQuestionSelectionEntity } from './user-report-doctor-question-selection.entity';
import { UserReportPreferencesEntity } from './user-report-preferences.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserReportPreferencesEntity,
      UserReportDoctorQuestionSelectionEntity,
      UserReportCustomDoctorQuestionEntity,
      UserReportConcernSelectionEntity,
    ]),
    AuthModule,
    UsersModule,
  ],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
