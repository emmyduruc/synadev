import { Linking, Platform } from 'react-native';

import { PLATFORM_OS } from '@/lib/ui';

/** Google Health Connect provider package on Play Store. */
export const HEALTH_CONNECT_PROVIDER_PACKAGE =
  'com.google.android.apps.healthdata' as const;

export const HEALTH_CONNECT_PLAY_STORE = {
  market: `market://details?id=${HEALTH_CONNECT_PROVIDER_PACKAGE}`,
  web: `https://play.google.com/store/apps/details?id=${HEALTH_CONNECT_PROVIDER_PACKAGE}`,
} as const;

export const HEALTH_CONNECT_AVAILABILITY = {
  available: 'available',
  /** Health Connect app missing or outdated; Play install/update may fix it. */
  providerUpdateRequired: 'provider_update_required',
  /** Device/OEM cannot host Health Connect (common on HMS-only Huawei). */
  sdkUnavailable: 'sdk_unavailable',
  /** Probe failed before a status could be read. */
  probeFailed: 'probe_failed',
} as const;

export type HealthConnectAvailability =
  (typeof HEALTH_CONNECT_AVAILABILITY)[keyof typeof HEALTH_CONNECT_AVAILABILITY];

export type HealthConnectAvailabilityResult = {
  availability: HealthConnectAvailability;
  sdkStatus: number | null;
};

const tryOpenUrl = async (url: string): Promise<boolean> => {
  try {
    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
      return false;
    }

    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Probes whether Google Health Connect can run on this Android device.
 * Safe to call before initialize / permission prompts.
 */
export const probeHealthConnectAvailability =
  async (): Promise<HealthConnectAvailabilityResult> => {
    if (Platform.OS !== PLATFORM_OS.android) {
      return {
        availability: HEALTH_CONNECT_AVAILABILITY.sdkUnavailable,
        sdkStatus: null,
      };
    }

    try {
      const healthConnect = await import('react-native-health-connect');
      const sdkStatus = await healthConnect.getSdkStatus();

      if (sdkStatus === healthConnect.SdkAvailabilityStatus.SDK_AVAILABLE) {
        return {
          availability: HEALTH_CONNECT_AVAILABILITY.available,
          sdkStatus,
        };
      }

      if (
        sdkStatus ===
        healthConnect.SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED
      ) {
        return {
          availability: HEALTH_CONNECT_AVAILABILITY.providerUpdateRequired,
          sdkStatus,
        };
      }

      return {
        availability: HEALTH_CONNECT_AVAILABILITY.sdkUnavailable,
        sdkStatus,
      };
    } catch {
      return {
        availability: HEALTH_CONNECT_AVAILABILITY.probeFailed,
        sdkStatus: null,
      };
    }
  };

/**
 * Opens Play Store for Health Connect when possible, otherwise Health Connect settings.
 * Returns whether an external surface was opened.
 */
export const openHealthConnectInstallOrSettings = async (): Promise<boolean> => {
  if (Platform.OS !== PLATFORM_OS.android) {
    return false;
  }

  const openedMarket = await tryOpenUrl(HEALTH_CONNECT_PLAY_STORE.market);

  if (openedMarket) {
    return true;
  }

  const openedWeb = await tryOpenUrl(HEALTH_CONNECT_PLAY_STORE.web);

  if (openedWeb) {
    return true;
  }

  try {
    const healthConnect = await import('react-native-health-connect');
    healthConnect.openHealthConnectSettings();
    return true;
  } catch {
    return false;
  }
};

export const isServiceUnavailableError = (message: string): boolean => {
  const normalized = message.trim().toLowerCase();
  return (
    normalized.includes('service not available') ||
    normalized.includes('sdk unavailable') ||
    normalized.includes('health connect is not available')
  );
};
