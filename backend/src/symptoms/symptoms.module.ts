import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

import { SymptomCategoryEntity } from './symptom-category.entity';
import { SymptomEntryEntity } from './symptom-entry.entity';
import { SymptomEntity } from './symptom.entity';
import { SymptomsController } from './symptoms.controller';
import { SymptomsService } from './symptoms.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SymptomCategoryEntity,
      SymptomEntity,
      SymptomEntryEntity,
    ]),
    AuthModule,
    UsersModule,
  ],
  controllers: [SymptomsController],
  providers: [SymptomsService],
  exports: [SymptomsService],
})
export class SymptomsModule {}
