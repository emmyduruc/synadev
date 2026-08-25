import type { MrsIiAssessmentSubmission } from '@syna/shared-types';
import { useEffect, useState } from 'react';

import { useLatestMrsIiAssessment } from '@/hooks/useLatestMrsIiAssessment';
import {
  getMrsIiAssessmentCompleted,
  setMrsIiAssessmentCompleted,
} from '@/lib/mrs/mrsIiBannerStorage';

export const useMrsIiAssessmentStatus = () => {
  const { submission: latestSubmission, isLoading, refresh } = useLatestMrsIiAssessment();
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    void (async () => {
      if (latestSubmission) {
        await setMrsIiAssessmentCompleted();
        setIsCompleted(true);
        return;
      }

      const completed = await getMrsIiAssessmentCompleted();
      setIsCompleted(completed);
    })();
  }, [latestSubmission]);

  return {
    isCompleted,
    latestSubmission: latestSubmission as MrsIiAssessmentSubmission | null,
    isLoading,
    refresh,
  };
};
