import { useCallback, useEffect, useState } from 'react';

import { useProfileHealthConnection } from '@/hooks/useProfileHealthConnection';
import { updateCurrentUserHealthMetrics, upsertHealthDailyMetrics } from '@/lib/api';
import { HEALTH_CONNECTION_ISSUE } from '@/lib/health/healthConnectionIssue';
import { readHealthSnapshot } from '@/lib/health/healthData';
import { logHealthSnapshotDebug } from '@/lib/health/healthDebug';
import {
  EMPTY_DASHBOARD_HEALTH_METRICS,
  parseDashboardHealthMetrics,
  type DashboardHealthMetricDisplay,
} from '@/lib/health/healthMetricDisplay';
import { toUpsertHealthDailyMetrics } from '@/lib/health/toHealthDailyMetrics';
import { toUserHealthMetrics } from '@/lib/health/toUserHealthMetrics';
import type { HealthRawSnapshot } from '@/lib/health/types';

const persistHealthMetricsSnapshot = async (snapshot: HealthRawSnapshot): Promise<void> => {
  try {
    await updateCurrentUserHealthMetrics(toUserHealthMetrics(snapshot));
  } catch {
    // Device read still succeeds; DB sync is best-effort until offline queue exists.
  }

  try {
    const daily = toUpsertHealthDailyMetrics(snapshot);

    if (daily.rows.length > 0) {
      await upsertHealthDailyMetrics(daily);
    }
  } catch {
    // Daily series sync is best-effort; Patterns will show needs_more_data until synced.
  }
};

export const useDashboardHealth = () => {
  const {
    summary,
    isConnecting,
    healthIssue,
    canInstallHealthConnect,
    isConnected,
    connectHealth,
    openHealthConnectHelp,
    refreshSummary,
  } = useProfileHealthConnection();
  const [healthSnapshot, setHealthSnapshot] = useState<HealthRawSnapshot | null>(null);
  const [metrics, setMetrics] = useState<readonly DashboardHealthMetricDisplay[]>(
    EMPTY_DASHBOARD_HEALTH_METRICS,
  );
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);

  const applyHealthSnapshot = useCallback((snapshot: HealthRawSnapshot) => {
    const parsedMetrics = parseDashboardHealthMetrics(snapshot);
    logHealthSnapshotDebug(snapshot, parsedMetrics);
    setHealthSnapshot(snapshot);
    setMetrics(parsedMetrics);
    void persistHealthMetricsSnapshot(snapshot);
    return parsedMetrics;
  }, []);

  const loadMetrics = useCallback(async () => {
    if (!isConnected) {
      setHealthSnapshot(null);
      setMetrics(EMPTY_DASHBOARD_HEALTH_METRICS);
      return;
    }

    setIsLoadingMetrics(true);

    try {
      const snapshot = await readHealthSnapshot();
      applyHealthSnapshot(snapshot);
    } finally {
      setIsLoadingMetrics(false);
    }
  }, [applyHealthSnapshot, isConnected]);

  useEffect(() => {
    void loadMetrics();
  }, [loadMetrics, summary?.requestedAt]);

  const connectAndRefresh = useCallback(async (): Promise<boolean> => {
    await connectHealth();
    await refreshSummary();

    setIsLoadingMetrics(true);

    try {
      const snapshot = await readHealthSnapshot();
      applyHealthSnapshot(snapshot);

      return (
        snapshot.status === 'connected' &&
        snapshot.metrics.some((metric) => !metric.error)
      );
    } finally {
      setIsLoadingMetrics(false);
    }
  }, [applyHealthSnapshot, connectHealth, refreshSummary]);

  return {
    summary,
    healthSnapshot,
    metrics,
    isConnecting,
    isLoadingMetrics,
    healthIssue,
    canInstallHealthConnect,
    hasHealthIssue: healthIssue !== HEALTH_CONNECTION_ISSUE.none,
    isConnected,
    connectHealth: connectAndRefresh,
    openHealthConnectHelp,
    refreshMetrics: loadMetrics,
  };
};
