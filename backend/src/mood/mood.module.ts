import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

import { MoodEntryFeelingEntity } from './mood-entry-feeling.entity';
import { MoodEntryEntity } from './mood-entry.entity';
import { MoodController } from './mood.controller';
import { MoodService } from './mood.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MoodEntryEntity, MoodEntryFeelingEntity]),
    AuthModule,
    UsersModule,
  ],
  controllers: [MoodController],
  providers: [MoodService],
})
export class MoodModule {}
