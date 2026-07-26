import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { UserEntity } from '../users/user.entity';
import { UsersModule } from '../users/users.module';

import { CycleNotificationService } from './cycle-notification.service';
import { NotificationsController } from './notifications.controller';
import { PushTokenEntity } from './push-token.entity';
import { PushService } from './push.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PushTokenEntity, UserEntity]),
    AuthModule,
    UsersModule,
    EmailModule,
  ],
  controllers: [NotificationsController],
  providers: [PushService, CycleNotificationService],
  exports: [PushService, CycleNotificationService],
})
export class NotificationsModule {}
