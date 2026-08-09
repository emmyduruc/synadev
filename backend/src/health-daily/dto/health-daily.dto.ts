import {
  GetHealthDailyMetricsQuerySchema,
  HealthDailyMetricsSchema,
  UpsertHealthDailyMetricsSchema,
} from '@syna/shared-types';
import { createZodDto } from 'nestjs-zod';

export class HealthDailyMetricsDto extends createZodDto(HealthDailyMetricsSchema) {}

export class UpsertHealthDailyMetricsDto extends createZodDto(
  UpsertHealthDailyMetricsSchema,
) {}

export class GetHealthDailyMetricsQueryDto extends createZodDto(
  GetHealthDailyMetricsQuerySchema,
) {}
