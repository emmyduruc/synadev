import type { MrsIiAssessmentSubmission } from '@syna/shared-types';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { getLatestMrsIiAssessment } from '@/lib/api';

export const useLatestMrsIiAssessment = () => {
  const [submission, setSubmission] = useState<MrsIiAssessmentSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);

    try {
      const latest = await getLatestMrsIiAssessment();
      setSubmission(latest.submission);
    } catch {
      setSubmission(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return { submission, isLoading, refresh };
};
