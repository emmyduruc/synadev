import { useCallback, useEffect, useState } from 'react';

import { HEALTH_READ_STATUS } from '@/lib/health/constants';
import {
  isHealthConnected,
  loadHealthConnectionSummary,
  saveHealthConnectionSummary,
  toHealthConnectionSummary,
  type HealthConnectionSummary,
} from '@/lib/health/healthConnectionSummary';
import { readHealthSnapshot } from '@/lib/health/healthData';
import { openHealthSettings } from '@/lib/health/openHealthSettings';

export const useProfileHealthConnection = () => {
  const [summary, setSummary] = useState<HealthConnectionSummary | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refreshSummary = useCallback(async () => {
    const cached = await loadHealthConnectionSummary();
    setSummary(cached);
  }, []);

  useEffect(() => {
    void refreshSummary();
  }, [refreshSummary]);

  const connectHealth = useCallback(async () => {
    setIsConnecting(true);
    setErrorMessage(null);

    try {
      const snapshot = await readHealthSnapshot();
      const nextSummary = toHealthConnectionSummary(snapshot);
      setSummary(nextSummary);
      await saveHealthConnectionSummary(nextSummary);

      if (snapshot.status === HEALTH_READ_STATUS.error) {
        const firstError = snapshot.metrics.find((metric) => metric.error)?.error;
        setErrorMessage(firstError ?? null);
      }
    } catch (error_) {
      const message = error_ instanceof Error ? error_.message : String(error_);
      setErrorMessage(message);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const modifyPermissions = useCallback(async () => {
    await openHealthSettings();
  }, []);

  const isConnected = isHealthConnected(summary);

  return {
    summary,
    isConnecting,
    errorMessage,
    isConnected,
    connectHealth,
    modifyPermissions,
    refreshSummary,
  };
};
