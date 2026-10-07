import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ClinicalProfileSchema,
  createEmptyClinicalProfile,
  type ClinicalProfile,
  type UpdateClinicalProfile,
} from '@syna/shared-types';
import { Repository } from 'typeorm';

import type { AuthenticatedClerkUser } from '../auth/auth.types';
import { UsersService } from '../users/users.service';

import { UserClinicalProfileEntity } from './user-clinical-profile.entity';

const toProfile = (
  entity: UserClinicalProfileEntity | null,
): ClinicalProfile => {
  if (!entity) {
    return createEmptyClinicalProfile();
  }

  return ClinicalProfileSchema.parse({
    uterusRemoved: entity.uterusRemoved,
    ovariesRemoved: entity.ovariesRemoved,
    endometrialAblation: entity.endometrialAblation,
    hormoneIud: entity.hormoneIud,
    hormonalContraception: entity.hormonalContraception,
    hormoneTherapy: entity.hormoneTherapy,
    thyroidDisease: entity.thyroidDisease,
    ageAtFirstPeriod: entity.ageAtFirstPeriod,
    persistentComplaintIds: [...(entity.persistentComplaintIds ?? [])],
    gynecologicalHistoryIds: [...(entity.gynecologicalHistoryIds ?? [])],
    generalConditionIds: [...(entity.generalConditionIds ?? [])],
    medicationTopicIds: [...(entity.medicationTopicIds ?? [])],
    lifestyleTopicIds: [...(entity.lifestyleTopicIds ?? [])],
    familyHistoryIds: [...(entity.familyHistoryIds ?? [])],
  });
};

@Injectable()
export class ClinicalProfileService {
  constructor(
    @InjectRepository(UserClinicalProfileEntity)
    private readonly profileRepository: Repository<UserClinicalProfileEntity>,
    private readonly usersService: UsersService,
  ) {}

  async getProfile(
    clerkUser: AuthenticatedClerkUser,
  ): Promise<ClinicalProfile> {
    const userId = await this.usersService.resolveUserId(clerkUser);
    const entity = await this.profileRepository.findOne({ where: { userId } });
    return toProfile(entity);
  }

  async replaceProfile(
    clerkUser: AuthenticatedClerkUser,
    input: UpdateClinicalProfile,
  ): Promise<ClinicalProfile> {
    const userId = await this.usersService.resolveUserId(clerkUser);

    await this.profileRepository.save(
      this.profileRepository.create({
        userId,
        uterusRemoved: input.uterusRemoved,
        ovariesRemoved: input.ovariesRemoved,
        endometrialAblation: input.endometrialAblation,
        hormoneIud: input.hormoneIud,
        hormonalContraception: input.hormonalContraception,
        hormoneTherapy: input.hormoneTherapy,
        thyroidDisease: input.thyroidDisease,
        ageAtFirstPeriod: input.ageAtFirstPeriod,
        persistentComplaintIds: [...input.persistentComplaintIds],
        gynecologicalHistoryIds: [...input.gynecologicalHistoryIds],
        generalConditionIds: [...input.generalConditionIds],
        medicationTopicIds: [...input.medicationTopicIds],
        lifestyleTopicIds: [...input.lifestyleTopicIds],
        familyHistoryIds: [...input.familyHistoryIds],
      }),
    );

    return this.getProfile(clerkUser);
  }
}
