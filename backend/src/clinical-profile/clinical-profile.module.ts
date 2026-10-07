import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

import { ClinicalProfileController } from './clinical-profile.controller';
import { ClinicalProfileService } from './clinical-profile.service';
import { UserClinicalProfileEntity } from './user-clinical-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserClinicalProfileEntity]),
    AuthModule,
    UsersModule,
  ],
  controllers: [ClinicalProfileController],
  providers: [ClinicalProfileService],
  exports: [ClinicalProfileService],
})
export class ClinicalProfileModule {}
