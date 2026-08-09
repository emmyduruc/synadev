import {
  HEALTH_METRIC_KEY,
  HEALTH_PLATFORM,
  isHealthMetricKey,
  type HealthMetricKey,
  type UpsertHealthDailyMetrics,
  type UserHealthMetricsMap,
} from '@syna/shared-types';

import { toDateKey } from '@/lib/date/dateKeys';
import type { HealthRawSnapshot } from '@/lib/health/types';

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

const resolveRecordDateKey = (record: unknown): string | null => {
  if (typeof record !== 'object' || record === null) {
    return null;
  }

  const typedRecord = record as Record<string, unknown>;
  const date =
    toDate(typedRecord.startDate) ??
    toDate(typedRecord.startTime) ??
    toDate(typedRecord.endDate) ??
    toDate(typedRecord.endTime) ??
    toDate(typedRecord.date);

  return date ? toDateKey(date) : null;
};

const sleepHoursForRecord = (record: unknown): number | null => {
  if (typeof record !== 'object' || record === null) {
    return null;
  }

  const typedRecord = record as Record<string, unknown>;
  const start = toDate(typedRecord.startDate ?? typedRecord.startTime);
  const end = toDate(typedRecord.endDate ?? typedRecord.endTime);

  if (!start || !end) {
    return null;
  }

  const durationMinutes = (end.getTime() - start.getTime()) / 60_000;

  if (durationMinutes <= 0) {
    return null;
  }

  return durationMinutes / 60;
};

type DayAccumulator = {
  sum: number;
  count: number;
};

const ensureDay = (
  byDay: Map<string, Partial<Record<HealthMetricKey, DayAccumulator>>>,
  dateKey: string,
  key: HealthMetricKey,
): DayAccumulator => {
  const day = byDay.get(dateKey) ?? {};
  const existing = day[key] ?? { sum: 0, count: 0 };
  day[key] = existing;
  byDay.set(dateKey, day);
  return existing;
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
 * Buckets raw device samples into per-day aggregates for PUT /health/daily.
 */
export const toUpsertHealthDailyMetrics = (
  snapshot: HealthRawSnapshot,
): UpsertHealthDailyMetrics => {
  const byDay = new Map<string, Partial<Record<HealthMetricKey, DayAccumulator>>>();

  for (const metric of snapshot.metrics) {
    if (metric.error || !isHealthMetricKey(metric.key) || !metric.records) {
      continue;
    }

    if (!Array.isArray(metric.records)) {
      continue;
    }

    const key = metric.key;

    for (const record of metric.records) {
      const dateKey = resolveRecordDateKey(record);

      if (!dateKey) {
        continue;
      }

      if (SLEEP_KEYS.has(key)) {
        const hours = sleepHoursForRecord(record);

        if (hours === null) {
          continue;
        }

        const acc = ensureDay(byDay, dateKey, key);
        acc.sum += hours;
        acc.count += 1;
        continue;
      }

      const value = extractRecordValue(record);

      if (value === null) {
        continue;
      }

      const acc = ensureDay(byDay, dateKey, key);
      acc.sum += value;
      acc.count += 1;
    }
  }

  const rows = [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateKey, dayMetrics]) => {
      const metrics: UserHealthMetricsMap = {};

      for (const [key, acc] of Object.entries(dayMetrics) as [
        HealthMetricKey,
        DayAccumulator,
      ][]) {
        if (!acc || acc.count === 0) {
          continue;
        }

        const value = CUMULATIVE_KEYS.has(key) || SLEEP_KEYS.has(key)
          ? acc.sum
          : acc.sum / acc.count;

        metrics[key] = {
          value,
          unit: METRIC_UNIT[key] ?? null,
        };
      }

      return { dateKey, metrics };
    })
    .filter((row) => Object.keys(row.metrics).length > 0);

  return {
    platform: toPlatform(snapshot.platform),
    rows,
  };
};
