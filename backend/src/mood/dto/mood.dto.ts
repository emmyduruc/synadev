import {
  MoodLogsSchema,
  ReplaceMoodLogsSchema,
} from '@syna/shared-types';
import { createZodDto } from 'nestjs-zod';

export class MoodLogsDto extends createZodDto(MoodLogsSchema) {}

export class ReplaceMoodLogsDto extends createZodDto(ReplaceMoodLogsSchema) {}
