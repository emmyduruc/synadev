import {
  ReportPreferencesSchema,
  UpdateReportPreferencesSchema,
} from '@syna/shared-types';
import { createZodDto } from 'nestjs-zod';

export class ReportPreferencesDto extends createZodDto(ReportPreferencesSchema) {}

export class UpdateReportPreferencesDto extends createZodDto(
  UpdateReportPreferencesSchema,
) {}
