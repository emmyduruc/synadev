import { useAuth } from '@clerk/expo';
import { useEffect } from 'react';

import { syncExpoPushRegistration } from '@/lib/notifications/syncExpoPushRegistration';

/**
 * Syncs preferred locale after sign-in. Registers an Expo push token only when
 * permission was already granted (e.g. returning user). Does not prompt.
 * First-time permission is requested from notification onboarding.
 */
export const useRegisterPushNotifications = () => {
  const { isLoaded, isSignedIn } = useAuth({ treatPendingAsSignedOut: false });

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    void syncExpoPushRegistration({ requestPermission: false }).catch(() => {
      // Permission denied / simulator without push — non-blocking.
    });
  }, [isLoaded, isSignedIn]);
};
