import { useCallback, useEffect, useState } from 'react';

import {
  getHomeWelcomeModalDismissed,
  setHomeWelcomeModalDismissed,
} from '@/lib/dashboard/homeWelcomeModalStorage';

/**
 * Shows the home welcome modal once per device until dismissed.
 * Existing users who never saw it still get it (dismissed flag unset).
 */
export const useHomeWelcomeModal = () => {
  const [isDismissed, setIsDismissed] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDismissState = async () => {
      const dismissed = await getHomeWelcomeModalDismissed();
      if (isMounted) {
        setIsDismissed(dismissed);
      }
    };

    void loadDismissState();

    return () => {
      isMounted = false;
    };
  }, []);

  const dismiss = useCallback(async () => {
    await setHomeWelcomeModalDismissed();
    setIsDismissed(true);
  }, []);

  return {
    isVisible: isDismissed === false,
    isLoading: isDismissed === null,
    dismiss,
  };
};
