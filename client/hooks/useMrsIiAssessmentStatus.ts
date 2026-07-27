import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { getMrsIiAssessmentCompleted } from '@/lib/mrs/mrsIiBannerStorage';

export const useMrsIiAssessmentStatus = () => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const completed = await getMrsIiAssessmentCompleted();
    setIsCompleted(completed);
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return { isCompleted, isLoading, refresh };
};
