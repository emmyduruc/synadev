import type { MrsIiAssessmentSubmission } from '@syna/shared-types';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { getLatestMrsIiAssessment } from '@/lib/api';

export const useLatestMrsIiAssessment = () => {
  const [submission, setSubmission] = useState<MrsIiAssessmentSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasHandledInitialFocusRef = useRef(false);

  const refresh = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setIsLoading(true);
    }

    try {
      const latest = await getLatestMrsIiAssessment();
      setSubmission(latest.submission);
    } catch {
      setSubmission(null);
    } finally {
      if (!options?.silent) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      if (!hasHandledInitialFocusRef.current) {
        hasHandledInitialFocusRef.current = true;
        return;
      }

      void refresh({ silent: true });
    }, [refresh]),
  );

  return { submission, isLoading, refresh };
};
