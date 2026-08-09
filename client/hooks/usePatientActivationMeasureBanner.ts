import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { getLatestPam13Assessment } from '@/lib/api';
import {
  getPatientActivationMeasureAssessmentCompleted,
  getPatientActivationMeasureBannerDismissed,
  setPatientActivationMeasureAssessmentCompleted,
  setPatientActivationMeasureBannerDismissed,
} from '@/lib/patientActivationMeasure/patientActivationMeasureBannerStorage';

export const usePatientActivationMeasureBanner = () => {
  const [isDismissed, setIsDismissed] = useState<boolean | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean | null>(null);

  const refresh = useCallback(async () => {
    const dismissed = await getPatientActivationMeasureBannerDismissed();
    setIsDismissed(dismissed);

    try {
      const latest = await getLatestPam13Assessment();

      if (latest.submission) {
        await setPatientActivationMeasureAssessmentCompleted();
        setIsCompleted(true);
        return;
      }
    } catch {
      // Fall back to local SecureStore when offline or API unavailable.
    }

    const completed = await getPatientActivationMeasureAssessmentCompleted();
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
    await setPatientActivationMeasureBannerDismissed();
    setIsDismissed(true);
  }, []);

  const isLoading = isDismissed === null || isCompleted === null;
  const isVisible = !isLoading && !isCompleted && !isDismissed;

  return {
    isVisible,
    isLoading,
    isCompleted: Boolean(isCompleted),
    dismiss,
    refresh,
  };
};
