import * as SecureStore from 'expo-secure-store';

import { HEALTH_READ_STATUS, HEALTH_SNAPSHOT_STORAGE_KEY } from '@/lib/health/constants';
import { isHealthMetricKey } from '@/lib/health/metricCatalog';
import type { HealthRawSnapshot } from '@/lib/health/types';

export type HealthConnectionSummary = {
  status: HealthRawSnapshot['status'];
  connectedMetricKeys: string[];
  requestedAt: string;
};

export const getConnectedMetricKeys = (snapshot: HealthRawSnapshot): string[] =>
  snapshot.metrics
    .filter((metric) => !metric.error)
    .map((metric) => metric.key)
    .filter(isHealthMetricKey);

export const toHealthConnectionSummary = (
  snapshot: HealthRawSnapshot,
): HealthConnectionSummary => ({
  status: snapshot.status,
  connectedMetricKeys: getConnectedMetricKeys(snapshot),
  requestedAt: snapshot.requestedAt,
});

export const saveHealthConnectionSummary = async (
  summary: HealthConnectionSummary,
): Promise<void> => {
  await SecureStore.setItemAsync(
    HEALTH_SNAPSHOT_STORAGE_KEY,
    JSON.stringify(summary),
  );
};

export const loadHealthConnectionSummary = async (): Promise<HealthConnectionSummary | null> => {
  const raw = await SecureStore.getItemAsync(HEALTH_SNAPSHOT_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as HealthConnectionSummary;

    if (
      typeof parsed.status !== 'string' ||
      !Array.isArray(parsed.connectedMetricKeys) ||
      typeof parsed.requestedAt !== 'string'
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const isHealthConnected = (summary: HealthConnectionSummary | null): boolean =>
  summary?.status === HEALTH_READ_STATUS.connected;
