import { z } from 'zod';

/**
 * Canonical health metric keys — shared by client HealthKit/Health Connect
 * reads and the persisted `users.health_metrics` JSONB column.
 */
export const HEALTH_METRIC_KEY = {
  steps: 'steps',
  heartRate: 'heart_rate',
  restingHeartRate: 'resting_heart_rate',
  hrvSdnn: 'hrv_sdnn',
  hrvRmssd: 'hrv_rmssd',
  respiratoryRate: 'respiratory_rate',
  oxygenSaturation: 'oxygen_saturation',
  wristTemperature: 'wrist_temperature',
  bodyTemperature: 'body_temperature',
  activeEnergy: 'active_energy',
  activeCalories: 'active_calories',
  exerciseMinutes: 'exercise_minutes',
  sleepAnalysis: 'sleep_analysis',
  sleepSessions: 'sleep_sessions',
} as const;

export const HEALTH_METRIC_KEYS = [
  HEALTH_METRIC_KEY.steps,
  HEALTH_METRIC_KEY.heartRate,
  HEALTH_METRIC_KEY.restingHeartRate,
  HEALTH_METRIC_KEY.hrvSdnn,
  HEALTH_METRIC_KEY.hrvRmssd,
  HEALTH_METRIC_KEY.respiratoryRate,
  HEALTH_METRIC_KEY.oxygenSaturation,
  HEALTH_METRIC_KEY.wristTemperature,
  HEALTH_METRIC_KEY.bodyTemperature,
  HEALTH_METRIC_KEY.activeEnergy,
  HEALTH_METRIC_KEY.activeCalories,
  HEALTH_METRIC_KEY.exerciseMinutes,
  HEALTH_METRIC_KEY.sleepAnalysis,
  HEALTH_METRIC_KEY.sleepSessions,
] as const;

export const HealthMetricKeySchema = z
  .enum(HEALTH_METRIC_KEYS)
  .describe('Canonical health metric identifier');

export type HealthMetricKey = z.infer<typeof HealthMetricKeySchema>;

export const isHealthMetricKey = (value: string): value is HealthMetricKey =>
  (HEALTH_METRIC_KEYS as readonly string[]).includes(value);

export const HEALTH_PLATFORM = {
  iosHealthkit: 'ios-healthkit',
  androidHealthConnect: 'android-health-connect',
  unsupported: 'unsupported',
} as const;

export const HealthPlatformSchema = z
  .enum([
    HEALTH_PLATFORM.iosHealthkit,
    HEALTH_PLATFORM.androidHealthConnect,
    HEALTH_PLATFORM.unsupported,
  ])
  .describe('Device health data platform');

export type HealthPlatform = z.infer<typeof HealthPlatformSchema>;

export const UserHealthMetricValueSchema = z
  .object({
    value: z
      .number()
      .finite()
      .nullable()
      .describe('Latest or today aggregate numeric reading; null if unavailable'),
    unit: z
      .string()
      .max(32)
      .nullable()
      .describe('Unit label (e.g. count, count/min, kcal, ms)'),
  })
  .describe('Single persisted health metric reading');

export type UserHealthMetricValue = z.infer<typeof UserHealthMetricValueSchema>;

/** Partial map — only keys present in the last device sync are stored. */
export const UserHealthMetricsMapSchema = z
  .object({
    [HEALTH_METRIC_KEY.steps]: UserHealthMetricValueSchema.optional(),
    [HEALTH_METRIC_KEY.heartRate]: UserHealthMetricValueSchema.optional(),
    [HEALTH_METRIC_KEY.restingHeartRate]: UserHealthMetricValueSchema.optional(),
    [HEALTH_METRIC_KEY.hrvSdnn]: UserHealthMetricValueSchema.optional(),
    [HEALTH_METRIC_KEY.hrvRmssd]: UserHealthMetricValueSchema.optional(),
    [HEALTH_METRIC_KEY.respiratoryRate]: UserHealthMetricValueSchema.optional(),
    [HEALTH_METRIC_KEY.oxygenSaturation]: UserHealthMetricValueSchema.optional(),
    [HEALTH_METRIC_KEY.wristTemperature]: UserHealthMetricValueSchema.optional(),
    [HEALTH_METRIC_KEY.bodyTemperature]: UserHealthMetricValueSchema.optional(),
    [HEALTH_METRIC_KEY.activeEnergy]: UserHealthMetricValueSchema.optional(),
    [HEALTH_METRIC_KEY.activeCalories]: UserHealthMetricValueSchema.optional(),
    [HEALTH_METRIC_KEY.exerciseMinutes]: UserHealthMetricValueSchema.optional(),
    [HEALTH_METRIC_KEY.sleepAnalysis]: UserHealthMetricValueSchema.optional(),
    [HEALTH_METRIC_KEY.sleepSessions]: UserHealthMetricValueSchema.optional(),
  })
  .describe('Map of metric key → latest value (partial)');

export type UserHealthMetricsMap = z.infer<typeof UserHealthMetricsMapSchema>;

/**
 * JSONB payload stored on `users.health_metrics`.
 * Summarized readings only — not raw HealthKit/Health Connect sample arrays.
 */
export const UserHealthMetricsSchema = z
  .object({
    platform: HealthPlatformSchema.describe('Source platform for this snapshot'),
    isConnected: z
      .boolean()
      .describe('Whether health permissions were granted when synced'),
    syncedAt: z
      .string()
      .datetime()
      .describe('ISO 8601 timestamp when this snapshot was written'),
    metrics: UserHealthMetricsMapSchema,
  })
  .describe('Persisted health metrics snapshot for a user');

export type UserHealthMetrics = z.infer<typeof UserHealthMetricsSchema>;

/** Request body for PATCH /users/me/health-metrics */
export const UpdateUserHealthMetricsSchema = UserHealthMetricsSchema;

export type UpdateUserHealthMetrics = z.infer<typeof UpdateUserHealthMetricsSchema>;
