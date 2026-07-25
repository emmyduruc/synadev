import {
  HEALTH_METRIC_KEY,
  HEALTH_PLATFORM,
  isHealthMetricKey,
  type HealthMetricKey,
  type UserHealthMetrics,
  type UserHealthMetricsMap,
} from '@syna/shared-types';

import type { HealthRawMetric, HealthRawSnapshot } from '@/lib/health/types';

const METRIC_UNIT: Partial<Record<HealthMetricKey, string>> = {
  [HEALTH_METRIC_KEY.steps]: 'count',
  [HEALTH_METRIC_KEY.heartRate]: 'count/min',
  [HEALTH_METRIC_KEY.restingHeartRate]: 'count/min',
  [HEALTH_METRIC_KEY.hrvSdnn]: 'ms',
  [HEALTH_METRIC_KEY.hrvRmssd]: 'ms',
  [HEALTH_METRIC_KEY.respiratoryRate]: 'count/min',
  [HEALTH_METRIC_KEY.oxygenSaturation]: '%',
  [HEALTH_METRIC_KEY.wristTemperature]: 'degC',
  [HEALTH_METRIC_KEY.bodyTemperature]: 'degC',
  [HEALTH_METRIC_KEY.activeEnergy]: 'kcal',
  [HEALTH_METRIC_KEY.activeCalories]: 'kcal',
  [HEALTH_METRIC_KEY.exerciseMinutes]: 'min',
  [HEALTH_METRIC_KEY.sleepAnalysis]: 'h',
  [HEALTH_METRIC_KEY.sleepSessions]: 'h',
};

const CUMULATIVE_KEYS = new Set<HealthMetricKey>([
  HEALTH_METRIC_KEY.steps,
  HEALTH_METRIC_KEY.activeEnergy,
  HEALTH_METRIC_KEY.activeCalories,
  HEALTH_METRIC_KEY.exerciseMinutes,
]);

const SLEEP_KEYS = new Set<HealthMetricKey>([
  HEALTH_METRIC_KEY.sleepAnalysis,
  HEALTH_METRIC_KEY.sleepSessions,
]);

const extractNumericValue = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'object' && value !== null) {
    const record = value as Record<string, unknown>;
    const nested = record.quantity ?? record.value ?? record.count;

    if (typeof nested === 'number' && Number.isFinite(nested)) {
      return nested;
    }
  }

  return null;
};

const getStatisticNumber = (statistics: unknown, key: string): number | null => {
  if (typeof statistics !== 'object' || statistics === null) {
    return null;
  }

  return extractNumericValue((statistics as Record<string, unknown>)[key]);
};

const extractRecordValue = (record: unknown): number | null => {
  if (typeof record !== 'object' || record === null) {
    return null;
  }

  const typedRecord = record as Record<string, unknown>;

  return (
    extractNumericValue(typedRecord.quantity) ??
    extractNumericValue(typedRecord.count) ??
    extractNumericValue(typedRecord.energy) ??
    extractNumericValue(typedRecord.total) ??
    extractNumericValue(typedRecord.heartRateVariabilityMillis) ??
    extractNumericValue(typedRecord.variabilityMillis)
  );
};

const sumRecordValues = (metric: HealthRawMetric): number | null => {
  if (!metric.records || !Array.isArray(metric.records)) {
    return null;
  }

  let sum = 0;
  let hasValue = false;

  for (const record of metric.records) {
    const value = extractRecordValue(record);

    if (value !== null) {
      sum += value;
      hasValue = true;
    }
  }

  return hasValue ? sum : null;
};

const averageRecordValues = (metric: HealthRawMetric): number | null => {
  if (!metric.records || !Array.isArray(metric.records)) {
    return null;
  }

  let sum = 0;
  let count = 0;

  for (const record of metric.records) {
    const value = extractRecordValue(record);

    if (value !== null) {
      sum += value;
      count += 1;
    }
  }

  return count > 0 ? sum / count : null;
};

const toDate = (value: unknown): Date | null => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
};

const getSleepHours = (metric: HealthRawMetric): number | null => {
  if (!metric.records || !Array.isArray(metric.records)) {
    return null;
  }

  let latestEnd: Date | null = null;
  let latestDurationMinutes = 0;

  for (const record of metric.records) {
    if (typeof record !== 'object' || record === null) {
      continue;
    }

    const typedRecord = record as Record<string, unknown>;
    const start = toDate(typedRecord.startDate ?? typedRecord.startTime);
    const end = toDate(typedRecord.endDate ?? typedRecord.endTime);

    if (!start || !end) {
      continue;
    }

    const durationMinutes = (end.getTime() - start.getTime()) / 60_000;

    if (durationMinutes <= 0) {
      continue;
    }

    if (!latestEnd || end.getTime() > latestEnd.getTime()) {
      latestEnd = end;
      latestDurationMinutes = durationMinutes;
    }
  }

  if (!latestEnd) {
    return null;
  }

  return latestDurationMinutes / 60;
};

const resolveMetricValue = (
  key: HealthMetricKey,
  metric: HealthRawMetric,
): number | null => {
  if (SLEEP_KEYS.has(key)) {
    return getSleepHours(metric);
  }

  if (CUMULATIVE_KEYS.has(key)) {
    return (
      getStatisticNumber(metric.statistics, 'cumulativeSum') ??
      getStatisticNumber(metric.statistics, 'sumQuantity') ??
      getStatisticNumber(metric.statistics, 'sum') ??
      sumRecordValues(metric)
    );
  }

  return (
    getStatisticNumber(metric.statistics, 'discreteAverage') ??
    getStatisticNumber(metric.statistics, 'averageQuantity') ??
    getStatisticNumber(metric.statistics, 'mostRecent') ??
    averageRecordValues(metric)
  );
};

const toPlatform = (platform: HealthRawSnapshot['platform']) => {
  if (platform === 'ios-healthkit') {
    return HEALTH_PLATFORM.iosHealthkit;
  }

  if (platform === 'android-health-connect') {
    return HEALTH_PLATFORM.androidHealthConnect;
  }

  return HEALTH_PLATFORM.unsupported;
};

/**
 * Maps a device health read into the shared `UserHealthMetrics` Zod shape
 * for PATCH /users/me/health-metrics.
 */
export const toUserHealthMetrics = (snapshot: HealthRawSnapshot): UserHealthMetrics => {
  const metrics: UserHealthMetricsMap = {};

  for (const metric of snapshot.metrics) {
    if (metric.error || !isHealthMetricKey(metric.key)) {
      continue;
    }

    metrics[metric.key] = {
      value: resolveMetricValue(metric.key, metric),
      unit: METRIC_UNIT[metric.key] ?? null,
    };
  }

  return {
    platform: toPlatform(snapshot.platform),
    isConnected: snapshot.status === 'connected',
    syncedAt: new Date().toISOString(),
    metrics,
  };
};
