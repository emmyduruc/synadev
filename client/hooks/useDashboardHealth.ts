import { useCallback, useEffect, useState } from 'react';

import { useProfileHealthConnection } from '@/hooks/useProfileHealthConnection';
import { readHealthSnapshot } from '@/lib/health/healthData';
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

  const loadMetrics = useCallback(async () => {
    if (!isConnected) {
      setHealthSnapshot(null);
      setMetrics(EMPTY_DASHBOARD_HEALTH_METRICS);
      return;
    }

    setIsLoadingMetrics(true);

    try {
      const snapshot = await readHealthSnapshot();
      setHealthSnapshot(snapshot);
      setMetrics(parseDashboardHealthMetrics(snapshot));
    } finally {
      setIsLoadingMetrics(false);
    }
  }, [isConnected]);

  useEffect(() => {
    void loadMetrics();
  }, [loadMetrics, summary?.requestedAt]);

  const connectAndRefresh = useCallback(async (): Promise<boolean> => {
    await connectHealth();
    await refreshSummary();

    setIsLoadingMetrics(true);

    try {
      const snapshot = await readHealthSnapshot();
      setHealthSnapshot(snapshot);
      setMetrics(parseDashboardHealthMetrics(snapshot));

      return snapshot.metrics.some((metric) => !metric.error);
    } finally {
      setIsLoadingMetrics(false);
    }
  }, [connectHealth, refreshSummary]);

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
