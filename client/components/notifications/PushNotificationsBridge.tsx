import { useRegisterPushNotifications } from '@/hooks/useRegisterPushNotifications';

/** Bridges Clerk auth → Expo push token registration (side-effect only). */
export const PushNotificationsBridge = () => {
  useRegisterPushNotifications();
  return null;
};
