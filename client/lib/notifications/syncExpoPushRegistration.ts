import { resolveAppLocale } from '@syna/shared-types';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { registerPushToken, updateCurrentUserLocale } from '@/lib/api';
import { i18n } from '@/lib/i18n';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const resolveCurrentLocale = () => resolveAppLocale(i18n.language);

const resolveExpoProjectId = (): string | undefined => {
  const easProjectId = Constants.easConfig?.projectId;
  const extraProjectId = Constants.expoConfig?.extra?.eas?.projectId;

  if (typeof easProjectId === 'string' && easProjectId.length > 0) {
    return easProjectId;
  }

  if (typeof extraProjectId === 'string' && extraProjectId.length > 0) {
    return extraProjectId;
  }

  return undefined;
};

/** Syncs device/app language to the backend (emails + push default to de). */
export const syncUserLocale = async (): Promise<void> => {
  await updateCurrentUserLocale({ locale: resolveCurrentLocale() });
};

export type SyncExpoPushRegistrationOptions = {
  /**
   * When true, shows the system permission prompt if not already decided.
   * Default false so signup / cold start does not interrupt onboarding.
   */
  requestPermission?: boolean;
};

/**
 * Optionally requests notification permission and best-effort registers the Expo
 * push token. Permission grant is what matters for onboarding; token sync can
 * fail on simulators / missing push credentials without blocking the user.
 */
export const syncExpoPushRegistration = async (
  options: SyncExpoPushRegistrationOptions = {},
): Promise<{ granted: boolean }> => {
  const { requestPermission = false } = options;

  await syncUserLocale();

  if (Platform.OS === 'web') {
    return { granted: false };
  }

  const permissions = await Notifications.getPermissionsAsync();
  let status = permissions.status;

  if (status !== 'granted' && requestPermission) {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }

  if (status !== 'granted') {
    return { granted: false };
  }

  try {
    const projectId = resolveExpoProjectId();
    const tokenResponse = projectId
      ? await Notifications.getExpoPushTokenAsync({ projectId })
      : await Notifications.getExpoPushTokenAsync();
    const platform = Platform.OS === 'ios' ? 'ios' : 'android';

    await registerPushToken({
      token: tokenResponse.data,
      platform,
      locale: resolveCurrentLocale(),
    });
  } catch {
    // Simulator / unsigned build / backend unavailable — permission was still granted.
  }

  return { granted: true };
};
