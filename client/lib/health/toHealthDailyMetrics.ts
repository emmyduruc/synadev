import {
  HEALTH_METRIC_KEY,
  HEALTH_PLATFORM,
  isHealthMetricKey,
  type HealthMetricKey,
  type UpsertHealthDailyMetrics,
  type UserHealthMetricsMap,
} from '@syna/shared-types';

import { toDateKey } from '@/lib/date/dateKeys';
import {
  aggregateHealthConnectSleep,
  aggregateHealthKitSleep,
  averageNightHeartRateByDay,
  type SleepDayTotals,
} from '@/lib/health/sleepAggregation';
import type { HealthRawMetric, HealthRawSnapshot } from '@/lib/health/types';

const METRIC_UNIT: Partial<Record<HealthMetricKey, string>> = {
  [HEALTH_METRIC_KEY.steps]: 'count',
  [HEALTH_METRIC_KEY.heartRate]: 'count/min',
  [HEALTH_METRIC_KEY.restingHeartRate]: 'count/min',
  [HEALTH_METRIC_KEY.nightHeartRate]: 'count/min',
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
  [HEALTH_METRIC_KEY.deepSleep]: 'h',
  [HEALTH_METRIC_KEY.remSleep]: 'h',
  [HEALTH_METRIC_KEY.lightSleep]: 'h',
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

type DayAccumulator = {
  sum: number;
  count: number;
};

type DayMetricMap = Partial<Record<HealthMetricKey, DayAccumulator>>;

const ensureDay = (
  byDay: Map<string, DayMetricMap>,
  dateKey: string,
  key: HealthMetricKey,
): DayAccumulator => {
  const day = byDay.get(dateKey) ?? {};
  const existing = day[key] ?? { sum: 0, count: 0 };
  day[key] = existing;
  byDay.set(dateKey, day);
  return existing;
};

const setDayMetricValue = (
  byDay: Map<string, DayMetricMap>,
  dateKey: string,
  key: HealthMetricKey,
  value: number,
) => {
  if (!Number.isFinite(value) || value <= 0) {
    return;
  }

  const acc = ensureDay(byDay, dateKey, key);
  acc.sum = value;
  acc.count = 1;
};

const findMetricRecords = (
  metrics: readonly HealthRawMetric[],
  key: HealthMetricKey,
): unknown[] => {
  for (const metric of metrics) {
    if (metric.error || metric.key !== key || !Array.isArray(metric.records)) {
      continue;
    }

    return metric.records;
  }

  return [];
};

const applySleepDerivedMetrics = (
  byDay: Map<string, DayMetricMap>,
  snapshot: HealthRawSnapshot,
) => {
  const sleepAnalysisRecords = findMetricRecords(
    snapshot.metrics,
    HEALTH_METRIC_KEY.sleepAnalysis,
  );
  const sleepSessionRecords = findMetricRecords(
    snapshot.metrics,
    HEALTH_METRIC_KEY.sleepSessions,
  );

  let sleepByDay = new Map<string, SleepDayTotals>();
  let intervals: ReturnType<typeof aggregateHealthKitSleep>['intervals'] = [];
  let sleepTotalKey: HealthMetricKey | null = null;

  if (sleepAnalysisRecords.length > 0) {
    const aggregated = aggregateHealthKitSleep(sleepAnalysisRecords);
    sleepByDay = aggregated.byDay;
    intervals = aggregated.intervals;
    sleepTotalKey = HEALTH_METRIC_KEY.sleepAnalysis;
  } else if (sleepSessionRecords.length > 0) {
    const aggregated = aggregateHealthConnectSleep(sleepSessionRecords);
    sleepByDay = aggregated.byDay;
    intervals = aggregated.intervals;
    sleepTotalKey = HEALTH_METRIC_KEY.sleepSessions;
  }

  for (const [dateKey, totals] of sleepByDay.entries()) {
    if (sleepTotalKey) {
      setDayMetricValue(byDay, dateKey, sleepTotalKey, totals.totalHours);
    }

    setDayMetricValue(byDay, dateKey, HEALTH_METRIC_KEY.deepSleep, totals.deepHours);
    setDayMetricValue(byDay, dateKey, HEALTH_METRIC_KEY.remSleep, totals.remHours);
    setDayMetricValue(byDay, dateKey, HEALTH_METRIC_KEY.lightSleep, totals.lightHours);
  }

  const heartRateRecords = findMetricRecords(
    snapshot.metrics,
    HEALTH_METRIC_KEY.heartRate,
  );

  if (heartRateRecords.length === 0 || intervals.length === 0) {
    return;
  }

  const nightHrByDay = averageNightHeartRateByDay(heartRateRecords, intervals);

  for (const [dateKey, bpm] of nightHrByDay.entries()) {
    setDayMetricValue(byDay, dateKey, HEALTH_METRIC_KEY.nightHeartRate, bpm);
  }
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
 * Sleep stages and night heart rate are derived from sleep windows + HR samples.
 */
export const toUpsertHealthDailyMetrics = (
  snapshot: HealthRawSnapshot,
): UpsertHealthDailyMetrics => {
  const byDay = new Map<string, DayMetricMap>();

  for (const metric of snapshot.metrics) {
    if (metric.error || !isHealthMetricKey(metric.key) || !metric.records) {
      continue;
    }

    if (!Array.isArray(metric.records)) {
      continue;
    }

    const key = metric.key;

    // Sleep duration/stages are derived from stage-aware aggregation below.
    if (SLEEP_KEYS.has(key)) {
      continue;
    }

    for (const record of metric.records) {
      const dateKey = resolveRecordDateKey(record);

      if (!dateKey) {
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

  applySleepDerivedMetrics(byDay, snapshot);

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

        const value =
          CUMULATIVE_KEYS.has(key) ||
          SLEEP_KEYS.has(key) ||
          key === HEALTH_METRIC_KEY.deepSleep ||
          key === HEALTH_METRIC_KEY.remSleep ||
          key === HEALTH_METRIC_KEY.lightSleep
            ? acc.sum
            : acc.sum / acc.count;

        metrics[key] = {
          value: Math.round(value * 100) / 100,
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
