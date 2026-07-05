import { Linking, Platform } from 'react-native';

import { HEALTH_SETTINGS_URL } from '@/lib/health/constants';
import { PLATFORM_OS } from '@/lib/ui';

export const openHealthSettings = async (): Promise<void> => {
  if (Platform.OS === PLATFORM_OS.ios) {
    const canOpen = await Linking.canOpenURL(HEALTH_SETTINGS_URL.appleHealth);

    if (canOpen) {
      await Linking.openURL(HEALTH_SETTINGS_URL.appleHealth);
    }

    return;
  }

  if (Platform.OS === PLATFORM_OS.android) {
    const healthConnect = await import('react-native-health-connect');
    healthConnect.openHealthConnectSettings();
  }
};
