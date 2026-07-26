import { useAuth } from '@clerk/expo';
import { useEffect } from 'react';

import { syncExpoPushRegistration } from '@/lib/notifications/syncExpoPushRegistration';

/**
 * Syncs preferred locale (device language → backend) and registers Expo push
 * once the user is signed in. Locale sync runs even if push permission is denied.
 */
export const useRegisterPushNotifications = () => {
  const { isLoaded, isSignedIn } = useAuth({ treatPendingAsSignedOut: false });

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    void syncExpoPushRegistration().catch(() => {
      // Permission denied / simulator without push — non-blocking.
      // Locale sync is attempted first inside syncExpoPushRegistration.
    });
  }, [isLoaded, isSignedIn]);
};
