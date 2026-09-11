import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { HEALTH_READ_STATUS } from '@/lib/health/constants';
import {
  openHealthConnectInstallOrSettings,
  probeHealthConnectAvailability,
} from '@/lib/health/healthConnectAvailability';
import {
  HEALTH_CONNECTION_ISSUE,
  issueFromHealthConnectAvailability,
  issueFromHealthSnapshot,
  shouldOfferHealthConnectInstall,
  type HealthConnectionIssue,
} from '@/lib/health/healthConnectionIssue';
import {
  isHealthConnected,
  loadHealthConnectionSummary,
  saveHealthConnectionSummary,
  toHealthConnectionSummary,
  type HealthConnectionSummary,
} from '@/lib/health/healthConnectionSummary';
import { readHealthSnapshot } from '@/lib/health/healthData';
import { PLATFORM_OS } from '@/lib/ui';

export const useProfileHealthConnection = () => {
  const [summary, setSummary] = useState<HealthConnectionSummary | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [healthIssue, setHealthIssue] = useState<HealthConnectionIssue>(
    HEALTH_CONNECTION_ISSUE.none,
  );

  const refreshSummary = useCallback(async () => {
    const cached = await loadHealthConnectionSummary();
    setSummary(cached);
  }, []);

  useEffect(() => {
    void refreshSummary();
  }, [refreshSummary]);

  useEffect(() => {
    if (Platform.OS !== PLATFORM_OS.android) {
      return;
    }

    let cancelled = false;

    const probe = async () => {
      const result = await probeHealthConnectAvailability();

      if (cancelled) {
        return;
      }

      const cached = await loadHealthConnectionSummary();

      if (cached?.status === HEALTH_READ_STATUS.connected) {
        return;
      }

      setHealthIssue(issueFromHealthConnectAvailability(result.availability));
    };

    void probe();

    return () => {
      cancelled = true;
    };
  }, []);

  const syncHealthConnection = useCallback(async () => {
    setIsConnecting(true);
    setHealthIssue(HEALTH_CONNECTION_ISSUE.none);

    try {
      const snapshot = await readHealthSnapshot();
      const nextSummary = toHealthConnectionSummary(snapshot);
      setSummary(nextSummary);
      await saveHealthConnectionSummary(nextSummary);
      setHealthIssue(issueFromHealthSnapshot(snapshot));
    } catch {
      setHealthIssue(HEALTH_CONNECTION_ISSUE.error);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const openHealthConnectHelp = useCallback(async () => {
    await openHealthConnectInstallOrSettings();
  }, []);

  const isConnected = isHealthConnected(summary);
  const canInstallHealthConnect = shouldOfferHealthConnectInstall(healthIssue);

  return {
    summary,
    isConnecting,
    healthIssue,
    canInstallHealthConnect,
    isConnected,
    connectHealth: syncHealthConnection,
    openHealthConnectHelp,
    refreshSummary,
  };
};
