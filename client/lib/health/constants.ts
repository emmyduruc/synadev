import type { HealthReadStatus } from '@/lib/health/types';

export const HEALTH_READ_STATUS = {
  idle: 'idle',
  connected: 'connected',
  unavailable: 'unavailable',
  error: 'error',
} as const satisfies Record<HealthReadStatus, HealthReadStatus>;

export const HEALTH_PLATFORM = {
  iosHealthkit: 'ios-healthkit',
  androidHealthConnect: 'android-health-connect',
  unsupported: 'unsupported',
} as const;

export const HEALTH_SETTINGS_URL = {
  appleHealth: 'x-apple-health://',
  appleHealthSources: 'x-apple-health://Sources/',
  appleHealthSharing: 'x-apple-health://sharing',
  androidPackageName: 'com.syna.app',
} as const;

export const HEALTH_SNAPSHOT_STORAGE_KEY = 'syna_health_snapshot_summary';
