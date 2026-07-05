export type HealthPlatform = 'ios-healthkit' | 'android-health-connect' | 'unsupported';

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
