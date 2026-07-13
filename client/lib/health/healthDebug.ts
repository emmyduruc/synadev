import type { DashboardHealthMetricDisplay } from '@/lib/health/healthMetricDisplay';
import type { HealthRawSnapshot } from '@/lib/health/types';

/* eslint-disable no-console -- intentional dev-only health payload logging */

const HEALTH_DEBUG_PREFIX = '[syna:health]';

export const logHealthSnapshotDebug = (
  snapshot: HealthRawSnapshot,
  parsedMetrics: readonly DashboardHealthMetricDisplay[],
): void => {
  if (!__DEV__) {
    return;
  }

  console.debug(`${HEALTH_DEBUG_PREFIX} raw snapshot JSON:\n${JSON.stringify(snapshot, null, 2)}`);
  console.debug(
    `${HEALTH_DEBUG_PREFIX} parsed dashboard metrics:\n${JSON.stringify(parsedMetrics, null, 2)}`,
  );
};

export type HealthMetricParseDebug = {
  stepsTotal: number | null;
  stepsToday: number | null;
  activityTotal: number | null;
  activityToday: number | null;
  hrvAverage: number | null;
  sleepHours: number | null;
  lookbackDays: number;
};

export const logHealthMetricParseDebug = (debug: HealthMetricParseDebug): void => {
  if (!__DEV__) {
    return;
  }

  console.debug(`${HEALTH_DEBUG_PREFIX} metric parse breakdown:`, debug);
};
