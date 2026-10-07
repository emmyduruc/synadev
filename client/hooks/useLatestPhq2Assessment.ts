import type { Phq2AssessmentSubmission } from '@syna/shared-types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getLatestPhq2Assessment } from '@/lib/api';
import { queryKeys } from '@/lib/query/queryKeys';

export const useLatestPhq2Assessment = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.assessments.phqLatest(),
    queryFn: async (): Promise<Phq2AssessmentSubmission | null> => {
      const latest = await getLatestPhq2Assessment();
      return latest.submission;
    },
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.assessments.phqLatest(),
    });
  }, [queryClient]);

  return {
    submission: query.data ?? null,
    isLoading: query.isLoading,
    refresh,
  };
};
