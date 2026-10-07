import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ZodValidationPipe } from 'nestjs-zod';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentsModule } from './appointments/appointments.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { ChatModule } from './chat/chat.module';
import { ClinicalProfileModule } from './clinical-profile/clinical-profile.module';
import { resolveEnvFilePaths } from './config/env-path';
import { CycleModule } from './cycle/cycle.module';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './email/email.module';
import { HealthController } from './health/health.controller';
import { HealthDailyModule } from './health-daily/health-daily.module';
import { MoodModule } from './mood/mood.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PeriodModule } from './period/period.module';
import { ReportModule } from './report/report.module';
import { SymptomsModule } from './symptoms/symptoms.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolveEnvFilePaths(),
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    UsersModule,
    NotificationsModule,
    CycleModule,
    PeriodModule,
    MoodModule,
    SymptomsModule,
    AssessmentsModule,
    HealthDailyModule,
    ReportModule,
    AppointmentsModule,
    ClinicalProfileModule,
    ChatModule,
    UploadsModule,
    EmailModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
