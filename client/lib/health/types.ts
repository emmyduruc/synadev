import type { HealthPlatform } from '@syna/shared-types';

import type { HealthConnectAvailability } from '@/lib/health/healthConnectAvailability';

export type { HealthPlatform };

export type HealthReadStatus = 'idle' | 'connected' | 'unavailable' | 'error';

export type HealthRawMetric = {
  key: string;
  source: 'healthkit' | 'health-connect';
  records?: unknown;
  statistics?: unknown;
  error?: string;
};

export type HealthRawSnapshot = {
  platform: HealthPlatform;
  status: HealthReadStatus;
  requestedAt: string;
  range: {
    start: string;
    end: string;
  };
  permissions?: unknown;
  metrics: HealthRawMetric[];
  /** Set when Android Health Connect cannot run on this device. */
  unavailabilityReason?: HealthConnectAvailability;
};
