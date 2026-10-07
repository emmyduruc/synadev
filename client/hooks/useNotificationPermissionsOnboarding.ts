import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { useTranslate } from '@/hooks/useTranslate';
import { exitOnboardingToHome } from '@/lib/navigation/exitOnboardingToHome';
import { syncExpoPushRegistration } from '@/lib/notifications/syncExpoPushRegistration';
import { setNotificationOnboardingCompleted } from '@/lib/onboarding/notificationOnboardingStorage';
import { toast } from '@/lib/sonner';

export const useNotificationPermissionsOnboarding = () => {
  const router = useRouter();
  const { t } = useTranslate();
  const [isRequesting, setIsRequesting] = useState(false);

  const finish = useCallback(async () => {
    await setNotificationOnboardingCompleted();
    exitOnboardingToHome(router);
  }, [router]);

  const allowNotifications = useCallback(async () => {
    setIsRequesting(true);

    try {
      const { granted } = await syncExpoPushRegistration({ requestPermission: true });

      if (!granted) {
        toast.error(t('notification_permission_denied_toast'));
        return;
      }

      await finish();
    } catch {
      // Unexpected failure after the permission step — still let them into the app.
      toast.error(t('notification_permission_error_toast'));
      await finish();
    } finally {
      setIsRequesting(false);
    }
  }, [finish, t]);

  const continueWithoutNotifications = useCallback(async () => {
    await finish();
  }, [finish]);

  return {
    isRequesting,
    allowNotifications,
    continueWithoutNotifications,
  };
};
