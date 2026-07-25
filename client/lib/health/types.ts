import type { HealthPlatform } from '@syna/shared-types';

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
};
