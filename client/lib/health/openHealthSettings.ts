import { Linking, Platform } from 'react-native';

import { HEALTH_SETTINGS_URL } from '@/lib/health/constants';
import { PLATFORM_OS } from '@/lib/ui';

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

const openAppleHealthPermissions = async (): Promise<void> => {
  // Apple does not document a per-app permission URL. These paths get closest
  // to Sources / Sharing → Apps, where users can change SYNA's read access.
  const urls = [
    HEALTH_SETTINGS_URL.appleHealthSources,
    HEALTH_SETTINGS_URL.appleHealthSharing,
    HEALTH_SETTINGS_URL.appleHealth,
  ];

  for (const url of urls) {
    const opened = await tryOpenUrl(url);

    if (opened) {
      return;
    }
  }
};

const openAndroidHealthPermissions = async (): Promise<void> => {
  const healthConnect = await import('react-native-health-connect');

  // Opens Health Connect permission management for this app (not the generic settings home).
  healthConnect.openHealthConnectDataManagement(HEALTH_SETTINGS_URL.androidPackageName);
};

export const openHealthSettings = async (): Promise<void> => {
  if (Platform.OS === PLATFORM_OS.ios) {
    await openAppleHealthPermissions();
    return;
  }

  if (Platform.OS === PLATFORM_OS.android) {
    await openAndroidHealthPermissions();
  }
};
