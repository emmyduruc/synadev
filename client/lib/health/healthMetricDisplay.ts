import { logHealthMetricParseDebug } from '@/lib/health/healthDebug';
import type { HealthRawMetric, HealthRawSnapshot } from '@/lib/health/types';

export const DASHBOARD_HEALTH_METRIC = {
  steps: 'steps',
  activity: 'activity',
  hrv: 'hrv',
  sleep: 'sleep',
} as const;

export type DashboardHealthMetricId =
  (typeof DASHBOARD_HEALTH_METRIC)[keyof typeof DASHBOARD_HEALTH_METRIC];

export type HealthTrendDirection = 'up' | 'down' | 'neutral';

export type DashboardHealthMetricDisplay = {
  id: DashboardHealthMetricId;
  value: string;
  trendDirection: HealthTrendDirection | null;
};

const LOOKBACK_DAYS = 14;

const getMetricByKey = (
  metrics: HealthRawMetric[],
  keys: readonly string[],
): HealthRawMetric | undefined =>
  metrics.find((metric) => keys.includes(metric.key) && !metric.error);

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

const sumRecordValues = (metric: HealthRawMetric | undefined): number | null => {
  if (!metric?.records || !Array.isArray(metric.records)) {
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

const averageRecordValues = (metric: HealthRawMetric | undefined): number | null => {
  if (!metric?.records || !Array.isArray(metric.records)) {
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

const getCumulativeTotal = (metric: HealthRawMetric | undefined): number | null => {
  if (!metric) {
    return null;
  }

  const fromStatistics =
    getStatisticNumber(metric.statistics, 'cumulativeSum') ??
    getStatisticNumber(metric.statistics, 'sumQuantity') ??
    getStatisticNumber(metric.statistics, 'sum');

  if (fromStatistics !== null) {
    return fromStatistics;
  }

  return sumRecordValues(metric);
};

const getDiscreteAverage = (metric: HealthRawMetric | undefined): number | null => {
  if (!metric) {
    return null;
  }

  const fromStatistics =
    getStatisticNumber(metric.statistics, 'discreteAverage') ??
    getStatisticNumber(metric.statistics, 'averageQuantity') ??
    getStatisticNumber(metric.statistics, 'mostRecent');

  if (fromStatistics !== null) {
    return fromStatistics;
  }

  return averageRecordValues(metric);
};

const isSameCalendarDay = (left: Date, right: Date): boolean =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

/** HealthKit returns `Date` objects at runtime; JSON logs show ISO strings. */
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

const parseRecordDate = (record: Record<string, unknown>): Date | null =>
  toDate(record.startDate ?? record.startTime);

/** Sum quantity-metric records that fall on the given calendar day (defaults to today). */
const getTodayRecordTotal = (
  metric: HealthRawMetric | undefined,
  referenceDate = new Date(),
): number | null => {
  if (!metric?.records || !Array.isArray(metric.records)) {
    return null;
  }

  let sum = 0;
  let hasValue = false;

  for (const record of metric.records) {
    if (typeof record !== 'object' || record === null) {
      continue;
    }

    const typedRecord = record as Record<string, unknown>;
    const recordDate = parseRecordDate(typedRecord);

    if (!recordDate || !isSameCalendarDay(recordDate, referenceDate)) {
      continue;
    }

    const value = extractRecordValue(record);

    if (value !== null) {
      sum += value;
      hasValue = true;
    }
  }

  return hasValue ? sum : null;
};

const getTodayCumulativeDisplayValue = (metric: HealthRawMetric | undefined): number | null => {
  if (!metric) {
    return null;
  }

  return getTodayRecordTotal(metric) ?? getCumulativeTotal(metric);
};

const getMostRecentSleepHours = (metric: HealthRawMetric | undefined): number | null => {
  if (!metric?.records || !Array.isArray(metric.records)) {
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

const formatCount = (value: number): string =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(Math.round(value));

const formatDecimal = (value: number, fractionDigits = 1): string =>
  new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(value);

const buildMetricDisplay = (
  id: DashboardHealthMetricId,
  value: string,
  trendDirection: HealthTrendDirection | null = null,
): DashboardHealthMetricDisplay => ({
  id,
  value,
  trendDirection,
});

export const EMPTY_DASHBOARD_HEALTH_METRICS: readonly DashboardHealthMetricDisplay[] = [
  buildMetricDisplay(DASHBOARD_HEALTH_METRIC.steps, '—'),
  buildMetricDisplay(DASHBOARD_HEALTH_METRIC.activity, '—'),
  buildMetricDisplay(DASHBOARD_HEALTH_METRIC.hrv, '—'),
  buildMetricDisplay(DASHBOARD_HEALTH_METRIC.sleep, '—'),
];

export const parseDashboardHealthMetrics = (
  snapshot: HealthRawSnapshot | null,
): readonly DashboardHealthMetricDisplay[] => {
  if (!snapshot || snapshot.metrics.length === 0) {
    return EMPTY_DASHBOARD_HEALTH_METRICS;
  }

  const stepsMetric = getMetricByKey(snapshot.metrics, ['steps']);
  const activityMetric = getMetricByKey(snapshot.metrics, ['exercise_minutes']);
  const hrvMetric = getMetricByKey(snapshot.metrics, ['hrv_sdnn', 'hrv_rmssd']);
  const sleepMetric = getMetricByKey(snapshot.metrics, ['sleep_analysis', 'sleep_sessions']);

  const stepsDisplay = getTodayCumulativeDisplayValue(stepsMetric);
  const activityDisplay = getTodayCumulativeDisplayValue(activityMetric);
  const hrvAverage = getDiscreteAverage(hrvMetric);
  const sleepHours = getMostRecentSleepHours(sleepMetric);

  logHealthMetricParseDebug({
    stepsTotal: getCumulativeTotal(stepsMetric),
    stepsToday: stepsDisplay,
    activityTotal: getCumulativeTotal(activityMetric),
    activityToday: activityDisplay,
    hrvAverage,
    sleepHours,
    lookbackDays: LOOKBACK_DAYS,
  });

  return [
    buildMetricDisplay(
      DASHBOARD_HEALTH_METRIC.steps,
      stepsDisplay === null ? '—' : formatCount(stepsDisplay),
    ),
    buildMetricDisplay(
      DASHBOARD_HEALTH_METRIC.activity,
      activityDisplay === null ? '—' : `${formatCount(activityDisplay)} min`,
    ),
    buildMetricDisplay(
      DASHBOARD_HEALTH_METRIC.hrv,
      hrvAverage === null ? '—' : `${formatCount(hrvAverage)} ms`,
    ),
    buildMetricDisplay(
      DASHBOARD_HEALTH_METRIC.sleep,
      sleepHours === null ? '—' : `${formatDecimal(sleepHours)} h`,
    ),
  ];
};
