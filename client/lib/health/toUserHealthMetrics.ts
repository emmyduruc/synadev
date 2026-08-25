import {
  HEALTH_METRIC_KEY,
  HEALTH_PLATFORM,
  isHealthMetricKey,
  type HealthMetricKey,
  type UserHealthMetrics,
  type UserHealthMetricsMap,
} from '@syna/shared-types';

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

const resolveMetricValue = (
  key: HealthMetricKey,
  metric: HealthRawMetric,
): number | null => {
  if (SLEEP_KEYS.has(key)) {
    // Sleep totals come from stage-aware aggregation in applySleepDerivedSummary.
    return null;
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

const findMetric = (
  metrics: readonly HealthRawMetric[],
  key: HealthMetricKey,
): HealthRawMetric | null => {
  for (const metric of metrics) {
    if (!metric.error && metric.key === key) {
      return metric;
    }
  }

  return null;
};

const pickLatestSleepDay = (
  byDay: Map<string, SleepDayTotals>,
): { dateKey: string; totals: SleepDayTotals } | null => {
  let latest: { dateKey: string; totals: SleepDayTotals } | null = null;

  for (const [dateKey, totals] of byDay.entries()) {
    if (!latest || dateKey > latest.dateKey) {
      latest = { dateKey, totals };
    }
  }

  return latest;
};

const roundMetric = (value: number): number => Math.round(value * 100) / 100;

const applySleepDerivedSummary = (
  metrics: UserHealthMetricsMap,
  snapshot: HealthRawSnapshot,
) => {
  const sleepAnalysis = findMetric(snapshot.metrics, HEALTH_METRIC_KEY.sleepAnalysis);
  const sleepSessions = findMetric(snapshot.metrics, HEALTH_METRIC_KEY.sleepSessions);

  let sleepByDay = new Map<string, SleepDayTotals>();
  let intervals: ReturnType<typeof aggregateHealthKitSleep>['intervals'] = [];
  let sleepTotalKey: HealthMetricKey | null = null;

  if (sleepAnalysis?.records && Array.isArray(sleepAnalysis.records)) {
    const aggregated = aggregateHealthKitSleep(sleepAnalysis.records);
    sleepByDay = aggregated.byDay;
    intervals = aggregated.intervals;
    sleepTotalKey = HEALTH_METRIC_KEY.sleepAnalysis;
  } else if (sleepSessions?.records && Array.isArray(sleepSessions.records)) {
    const aggregated = aggregateHealthConnectSleep(sleepSessions.records);
    sleepByDay = aggregated.byDay;
    intervals = aggregated.intervals;
    sleepTotalKey = HEALTH_METRIC_KEY.sleepSessions;
  }

  const latest = pickLatestSleepDay(sleepByDay);

  if (latest && sleepTotalKey) {
    metrics[sleepTotalKey] = {
      value: roundMetric(latest.totals.totalHours),
      unit: METRIC_UNIT[sleepTotalKey] ?? 'h',
    };

    if (latest.totals.deepHours > 0) {
      metrics[HEALTH_METRIC_KEY.deepSleep] = {
        value: roundMetric(latest.totals.deepHours),
        unit: 'h',
      };
    }

    if (latest.totals.remHours > 0) {
      metrics[HEALTH_METRIC_KEY.remSleep] = {
        value: roundMetric(latest.totals.remHours),
        unit: 'h',
      };
    }

    if (latest.totals.lightHours > 0) {
      metrics[HEALTH_METRIC_KEY.lightSleep] = {
        value: roundMetric(latest.totals.lightHours),
        unit: 'h',
      };
    }
  }

  const heartRate = findMetric(snapshot.metrics, HEALTH_METRIC_KEY.heartRate);

  if (
    !heartRate?.records ||
    !Array.isArray(heartRate.records) ||
    intervals.length === 0 ||
    !latest
  ) {
    return;
  }

  const nightHrByDay = averageNightHeartRateByDay(heartRate.records, intervals);
  const nightHr = nightHrByDay.get(latest.dateKey);

  if (nightHr !== undefined && Number.isFinite(nightHr) && nightHr > 0) {
    metrics[HEALTH_METRIC_KEY.nightHeartRate] = {
      value: roundMetric(nightHr),
      unit: 'count/min',
    };
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
 * Maps a device health read into the shared `UserHealthMetrics` Zod shape
 * for PATCH /users/me/health-metrics.
 */
export const toUserHealthMetrics = (snapshot: HealthRawSnapshot): UserHealthMetrics => {
  const metrics: UserHealthMetricsMap = {};

  for (const metric of snapshot.metrics) {
    if (metric.error || !isHealthMetricKey(metric.key)) {
      continue;
    }

    if (SLEEP_KEYS.has(metric.key)) {
      continue;
    }

    const value = resolveMetricValue(metric.key, metric);

    metrics[metric.key] = {
      value,
      unit: METRIC_UNIT[metric.key] ?? null,
    };
  }

  applySleepDerivedSummary(metrics, snapshot);

  return {
    platform: toPlatform(snapshot.platform),
    isConnected: snapshot.status === 'connected',
    syncedAt: new Date().toISOString(),
    metrics,
  };
};
