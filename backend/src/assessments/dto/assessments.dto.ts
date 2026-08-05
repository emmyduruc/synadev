import {
  MrsIiAssessmentSubmissionSchema,
  MrsIiLatestSchema,
  Pam13AssessmentSubmissionSchema,
  Pam13LatestSchema,
  SubmitMrsIiAssessmentSchema,
  SubmitPam13AssessmentSchema,
} from '@syna/shared-types';
import { createZodDto } from 'nestjs-zod';

export class SubmitMrsIiAssessmentDto extends createZodDto(SubmitMrsIiAssessmentSchema) {}
export class MrsIiAssessmentSubmissionDto extends createZodDto(MrsIiAssessmentSubmissionSchema) {}
export class MrsIiLatestDto extends createZodDto(MrsIiLatestSchema) {}

export class SubmitPam13AssessmentDto extends createZodDto(SubmitPam13AssessmentSchema) {}
export class Pam13AssessmentSubmissionDto extends createZodDto(Pam13AssessmentSubmissionSchema) {}
export class Pam13LatestDto extends createZodDto(Pam13LatestSchema) {}
