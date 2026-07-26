import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import {
  getPatientActivationMeasureAssessmentCompleted,
  getPatientActivationMeasureBannerDismissed,
  setPatientActivationMeasureBannerDismissed,
} from '@/lib/patientActivationMeasure/patientActivationMeasureBannerStorage';

export const usePatientActivationMeasureBanner = () => {
  const [isDismissed, setIsDismissed] = useState<boolean | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean | null>(null);

  const refresh = useCallback(async () => {
    const [dismissed, completed] = await Promise.all([
      getPatientActivationMeasureBannerDismissed(),
      getPatientActivationMeasureAssessmentCompleted(),
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
    await setPatientActivationMeasureBannerDismissed();
    setIsDismissed(true);
  }, []);

  const isLoading = isDismissed === null || isCompleted === null;
  const isVisible = !isLoading && !isCompleted && !isDismissed;

  return {
    isVisible,
    isLoading,
    dismiss,
    refresh,
  };
};
