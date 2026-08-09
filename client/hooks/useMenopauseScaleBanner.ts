import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { getLatestMrsIiAssessment } from '@/lib/api';
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
    const dismissed = await getMrsIiBannerDismissed();
    setIsDismissed(dismissed);

    try {
      const latest = await getLatestMrsIiAssessment();

      if (latest.submission) {
        await setMrsIiAssessmentCompleted();
        setIsCompleted(true);
        return;
      }
    } catch {
      // Fall back to local SecureStore when offline or API unavailable.
    }

    const completed = await getMrsIiAssessmentCompleted();
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
    isCompleted: Boolean(isCompleted),
    dismiss,
    markCompleted,
    refresh,
  };
};
