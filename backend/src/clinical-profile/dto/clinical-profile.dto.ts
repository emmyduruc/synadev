import {
  ClinicalProfileSchema,
  UpdateClinicalProfileSchema,
} from '@syna/shared-types';
import { createZodDto } from 'nestjs-zod';

export class ClinicalProfileDto extends createZodDto(ClinicalProfileSchema) {}

export class UpdateClinicalProfileDto extends createZodDto(
  UpdateClinicalProfileSchema,
) {}
