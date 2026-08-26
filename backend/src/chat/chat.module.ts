import { Module } from '@nestjs/common';

import { AssessmentsModule } from '../assessments/assessments.module';
import { AuthModule } from '../auth/auth.module';
import { CycleModule } from '../cycle/cycle.module';
import { HealthDailyModule } from '../health-daily/health-daily.module';
import { MoodModule } from '../mood/mood.module';
import { PeriodModule } from '../period/period.module';
import { SymptomsModule } from '../symptoms/symptoms.module';
import { UsersModule } from '../users/users.module';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PeriodModule,
    MoodModule,
    SymptomsModule,
    HealthDailyModule,
    CycleModule,
    AssessmentsModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
