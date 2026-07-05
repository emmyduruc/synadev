import { useCallback, useEffect, useState } from 'react';

import { PROFILE_COMPLETION_PERCENT } from '@/lib/profile/constants';
import {
  getProfileCompletionBannerDismissed,
  setProfileCompletionBannerDismissed,
} from '@/lib/profile/profileCompletionBannerStorage';

export const useProfileCompletionBanner = () => {
  const [isDismissed, setIsDismissed] = useState<boolean | null>(null);
  const percent = PROFILE_COMPLETION_PERCENT;
  const isComplete = percent >= 100;

  useEffect(() => {
    let isMounted = true;

    const loadDismissState = async () => {
      const dismissed = await getProfileCompletionBannerDismissed();
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
    await setProfileCompletionBannerDismissed();
    setIsDismissed(true);
  }, []);

  const isVisible = !isComplete && isDismissed === false;
  const isLoading = isDismissed === null;

  return {
    percent,
    isVisible,
    isLoading,
    dismiss,
  };
};
