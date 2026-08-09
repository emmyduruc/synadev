import { z } from 'zod';

import {
  HEALTH_PLATFORM,
  HealthPlatformSchema,
  UserHealthMetricsMapSchema,
} from './health-metrics.schema';
import { IsoDateSchema } from './iso-date.schema';

/** Max inclusive range for GET /health/daily */
export const HEALTH_DAILY_MAX_RANGE_DAYS = 90;

export const HealthDailyMetricRowSchema = z
  .object({
    dateKey: IsoDateSchema.describe('Local calendar day for this aggregate'),
    metrics: UserHealthMetricsMapSchema.describe(
      'Per-day summarized metric map (partial keys only)',
    ),
  })
  .describe('One day of aggregated wearable health metrics');

export type HealthDailyMetricRow = z.infer<typeof HealthDailyMetricRowSchema>;

export const HealthDailyMetricsSchema = z
  .object({
    platform: HealthPlatformSchema.describe('Source platform for these rows'),
    rows: z
      .array(HealthDailyMetricRowSchema)
      .max(HEALTH_DAILY_MAX_RANGE_DAYS)
      .describe('Daily metric rows ordered by dateKey ascending'),
  })
  .describe('Health daily series response');

export type HealthDailyMetrics = z.infer<typeof HealthDailyMetricsSchema>;

/** PUT /health/daily — upsert the given days (does not delete other days). */
export const UpsertHealthDailyMetricsSchema = z
  .object({
    platform: HealthPlatformSchema.describe('Source platform for this sync'),
    rows: z
      .array(HealthDailyMetricRowSchema)
      .max(HEALTH_DAILY_MAX_RANGE_DAYS)
      .describe('Days to upsert from the device lookback window'),
  })
  .describe('Upsert batch of daily health metric rows');

export type UpsertHealthDailyMetrics = z.infer<typeof UpsertHealthDailyMetricsSchema>;

export const GetHealthDailyMetricsQuerySchema = z
  .object({
    from: IsoDateSchema.describe('Inclusive range start (YYYY-MM-DD)'),
    to: IsoDateSchema.describe('Inclusive range end (YYYY-MM-DD)'),
  })
  .describe('Query for GET /health/daily');

export type GetHealthDailyMetricsQuery = z.infer<typeof GetHealthDailyMetricsQuerySchema>;

export { HEALTH_PLATFORM };
