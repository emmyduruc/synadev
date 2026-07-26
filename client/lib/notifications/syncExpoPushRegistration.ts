import { resolveAppLocale } from '@syna/shared-types';
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

/** Syncs device/app language to the backend (emails + push default to de). */
export const syncUserLocale = async (): Promise<void> => {
  await updateCurrentUserLocale({ locale: resolveCurrentLocale() });
};

/**
 * Requests permission and registers the Expo push token with the backend.
 * Also syncs locale so phase emails/push use the device language.
 */
export const syncExpoPushRegistration = async (): Promise<void> => {
  await syncUserLocale();

  if (Platform.OS === 'web') {
    return;
  }

  const permissions = await Notifications.getPermissionsAsync();
  let status = permissions.status;

  if (status !== 'granted') {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }

  if (status !== 'granted') {
    return;
  }

  const tokenResponse = await Notifications.getExpoPushTokenAsync();
  const platform = Platform.OS === 'ios' ? 'ios' : 'android';

  await registerPushToken({
    token: tokenResponse.data,
    platform,
    locale: resolveCurrentLocale(),
  });
};
