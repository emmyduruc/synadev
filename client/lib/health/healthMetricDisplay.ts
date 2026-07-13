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

const getStatisticNumber = (statistics: unknown, key: string): number | null => {
  if (typeof statistics !== 'object' || statistics === null) {
    return null;
  }

  const value = (statistics as Record<string, unknown>)[key];

  return typeof value === 'number' && Number.isFinite(value) ? value : null;
};

const formatCount = (value: number): string =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(Math.round(value));

const formatDecimal = (value: number, fractionDigits = 1): string =>
  new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(value);

const getDailyAverage = (total: number): number => total / LOOKBACK_DAYS;

const estimateSleepHours = (metric: HealthRawMetric | undefined): number | null => {
  if (!metric?.records || !Array.isArray(metric.records)) {
    return null;
  }

  let asleepMinutes = 0;

  for (const record of metric.records) {
    if (typeof record !== 'object' || record === null) {
      continue;
    }

    const typedRecord = record as Record<string, unknown>;
    const startValue = typedRecord.startDate ?? typedRecord.startTime;
    const endValue = typedRecord.endDate ?? typedRecord.endTime;

    if (typeof startValue !== 'string' || typeof endValue !== 'string') {
      continue;
    }

    const start = new Date(startValue);
    const end = new Date(endValue);
    const durationMinutes = (end.getTime() - start.getTime()) / 60_000;

    if (durationMinutes > 0) {
      asleepMinutes += durationMinutes;
    }
  }

  if (asleepMinutes <= 0) {
    return null;
  }

  return asleepMinutes / 60 / LOOKBACK_DAYS;
};

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

  const stepsTotal = getStatisticNumber(stepsMetric?.statistics, 'cumulativeSum');
  const activityTotal = getStatisticNumber(activityMetric?.statistics, 'cumulativeSum');
  const hrvAverage =
    getStatisticNumber(hrvMetric?.statistics, 'discreteAverage') ??
    getStatisticNumber(hrvMetric?.statistics, 'mostRecent');
  const sleepHours = estimateSleepHours(sleepMetric);

  return [
    buildMetricDisplay(
      DASHBOARD_HEALTH_METRIC.steps,
      stepsTotal === null ? '—' : formatCount(getDailyAverage(stepsTotal)),
      stepsTotal === null ? null : 'down',
    ),
    buildMetricDisplay(
      DASHBOARD_HEALTH_METRIC.activity,
      activityTotal === null ? '—' : `${formatCount(getDailyAverage(activityTotal))} min`,
      activityTotal === null ? null : 'down',
    ),
    buildMetricDisplay(
      DASHBOARD_HEALTH_METRIC.hrv,
      hrvAverage === null ? '—' : `${formatCount(hrvAverage)} ms`,
      hrvAverage === null ? null : 'down',
    ),
    buildMetricDisplay(
      DASHBOARD_HEALTH_METRIC.sleep,
      sleepHours === null ? '—' : `${formatDecimal(sleepHours)} h`,
      sleepHours === null ? null : 'down',
    ),
  ];
};
