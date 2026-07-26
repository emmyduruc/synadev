import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { CycleModule } from '../cycle/cycle.module';
import { UsersModule } from '../users/users.module';

import { PeriodDayEntity } from './period-day.entity';
import { PeriodController } from './period.controller';
import { PeriodService } from './period.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PeriodDayEntity]),
    AuthModule,
    UsersModule,
    CycleModule,
  ],
  controllers: [PeriodController],
  providers: [PeriodService],
})
export class PeriodModule {}
