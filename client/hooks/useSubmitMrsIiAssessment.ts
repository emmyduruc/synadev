import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { submitMrsIiAssessment } from '@/lib/api';
import { setMrsIiAssessmentCompleted } from '@/lib/mrs/mrsIiBannerStorage';
import type { MrsIiSubmissionPayload } from '@/lib/mrs/mrsIiTypes';
import { queryKeys } from '@/lib/query/queryKeys';

export const useSubmitMrsIiAssessment = () => {
  const queryClient = useQueryClient();

  const submit = useCallback(
    async (payload: MrsIiSubmissionPayload) => {
      const submission = await submitMrsIiAssessment({
        assessmentId: payload.assessmentId,
        timepoint: payload.timepoint,
        answers: payload.answers,
      });
      await setMrsIiAssessmentCompleted();
      queryClient.setQueryData(queryKeys.assessments.mrsLatest(), submission);
      void queryClient.invalidateQueries({
        queryKey: queryKeys.assessments.mrsLatest(),
      });
      return submission;
    },
    [queryClient],
  );

  return { submit };
};
