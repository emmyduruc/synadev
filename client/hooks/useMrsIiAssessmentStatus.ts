import type { MrsIiAssessmentSubmission } from '@syna/shared-types';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { getLatestMrsIiAssessment } from '@/lib/api';
import {
  getMrsIiAssessmentCompleted,
  setMrsIiAssessmentCompleted,
} from '@/lib/mrs/mrsIiBannerStorage';

export const useMrsIiAssessmentStatus = () => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [latestSubmission, setLatestSubmission] = useState<MrsIiAssessmentSubmission | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);

    try {
      const latest = await getLatestMrsIiAssessment();

      if (latest.submission) {
        await setMrsIiAssessmentCompleted();
        setLatestSubmission(latest.submission);
        setIsCompleted(true);
        return;
      }

      setLatestSubmission(null);
    } catch {
      setLatestSubmission(null);
      // Fall back to local SecureStore when offline or API unavailable.
    }

    const completed = await getMrsIiAssessmentCompleted();
    setIsCompleted(completed);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh().finally(() => {
        setIsLoading(false);
      });
    }, [refresh]),
  );

  return { isCompleted, latestSubmission, isLoading, refresh };
};
