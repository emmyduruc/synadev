import {
  PeriodDaysSchema,
  ReplacePeriodDaysSchema,
} from '@syna/shared-types';
import { createZodDto } from 'nestjs-zod';

export class PeriodDaysDto extends createZodDto(PeriodDaysSchema) {}

export class ReplacePeriodDaysDto extends createZodDto(ReplacePeriodDaysSchema) {}
