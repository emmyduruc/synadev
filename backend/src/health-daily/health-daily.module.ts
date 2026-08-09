import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

import { HealthDailyMetricEntity } from './health-daily-metric.entity';
import { HealthDailyController } from './health-daily.controller';
import { HealthDailyService } from './health-daily.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HealthDailyMetricEntity]),
    AuthModule,
    UsersModule,
  ],
  controllers: [HealthDailyController],
  providers: [HealthDailyService],
  exports: [HealthDailyService],
})
export class HealthDailyModule {}
