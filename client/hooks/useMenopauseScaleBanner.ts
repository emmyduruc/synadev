import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import {
  getMrsIiAssessmentCompleted,
  getMrsIiBannerDismissed,
  setMrsIiAssessmentCompleted,
  setMrsIiBannerDismissed,
} from '@/lib/mrs/mrsIiBannerStorage';

export const useMenopauseScaleBanner = () => {
  const [isDismissed, setIsDismissed] = useState<boolean | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean | null>(null);

  const refresh = useCallback(async () => {
    const [dismissed, completed] = await Promise.all([
      getMrsIiBannerDismissed(),
      getMrsIiAssessmentCompleted(),
    ]);

    setIsDismissed(dismissed);
    setIsCompleted(completed);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const dismiss = useCallback(async () => {
    await setMrsIiBannerDismissed();
    setIsDismissed(true);
  }, []);

  const markCompleted = useCallback(async () => {
    await setMrsIiAssessmentCompleted();
    setIsCompleted(true);
  }, []);

  const isLoading = isDismissed === null || isCompleted === null;
  const isVisible = !isLoading && !isCompleted && !isDismissed;

  return {
    isVisible,
    isLoading,
    dismiss,
    markCompleted,
    refresh,
  };
};
