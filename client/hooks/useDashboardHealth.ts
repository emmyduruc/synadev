import { useCallback, useEffect, useState } from 'react';

import { useProfileHealthConnection } from '@/hooks/useProfileHealthConnection';
import { readHealthSnapshot } from '@/lib/health/healthData';
import { logHealthSnapshotDebug } from '@/lib/health/healthDebug';
import {
  EMPTY_DASHBOARD_HEALTH_METRICS,
  parseDashboardHealthMetrics,
  type DashboardHealthMetricDisplay,
} from '@/lib/health/healthMetricDisplay';
import type { HealthRawSnapshot } from '@/lib/health/types';

export const useDashboardHealth = () => {
  const {
    summary,
    isConnecting,
    errorMessage,
    isConnected,
    connectHealth,
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

      return snapshot.metrics.some((metric) => !metric.error);
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
    errorMessage,
    isConnected,
    connectHealth: connectAndRefresh,
    refreshMetrics: loadMetrics,
  };
};
