import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { useBioData } from '@/hooks/useBioData';
import {
  getProfileCompletionBannerDismissed,
  setProfileCompletionBannerDismissed,
} from '@/lib/profile/profileCompletionBannerStorage';

export const useProfileCompletionBanner = () => {
  const { percent, isComplete, isLoading: isBioLoading, refresh } = useBioData();
  const [isDismissed, setIsDismissed] = useState<boolean | null>(null);

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

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const dismiss = useCallback(async () => {
    await setProfileCompletionBannerDismissed();
    setIsDismissed(true);
  }, []);

  const isVisible = !isComplete && isDismissed === false;
  const isLoading = isBioLoading || isDismissed === null;

  return {
    percent,
    isVisible,
    isLoading,
    dismiss,
  };
};
