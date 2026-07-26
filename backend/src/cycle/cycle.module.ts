import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PeriodDayEntity } from '../period/period-day.entity';
import { UsersModule } from '../users/users.module';

import { CycleController } from './cycle.controller';
import { CycleService } from './cycle.service';
import { UserCycleStateEntity } from './user-cycle-state.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PeriodDayEntity, UserCycleStateEntity]),
    AuthModule,
    UsersModule,
    NotificationsModule,
  ],
  controllers: [CycleController],
  providers: [CycleService],
  exports: [CycleService],
})
export class CycleModule {}
