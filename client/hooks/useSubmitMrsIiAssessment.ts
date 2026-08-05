import { useCallback } from 'react';

import { submitMrsIiAssessment } from '@/lib/api';
import { setMrsIiAssessmentCompleted } from '@/lib/mrs/mrsIiBannerStorage';
import type { MrsIiSubmissionPayload } from '@/lib/mrs/mrsIiTypes';

export const useSubmitMrsIiAssessment = () => {
  const submit = useCallback(async (payload: MrsIiSubmissionPayload) => {
    const submission = await submitMrsIiAssessment({
      assessmentId: payload.assessmentId,
      timepoint: payload.timepoint,
      answers: payload.answers,
    });
    await setMrsIiAssessmentCompleted();
    return submission;
  }, []);

  return { submit };
};
