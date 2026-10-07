import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { getLatestMrsIiAssessment } from '@/lib/api';
import { queryKeys } from '@/lib/query/queryKeys';

export const useLatestMrsIiAssessment = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.assessments.mrsLatest(),
    queryFn: async () => {
      const latest = await getLatestMrsIiAssessment();
      return latest.submission;
    },
  });

  const { refetch } = query;

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.assessments.mrsLatest(),
    });
  }, [queryClient]);

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  return {
    submission: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refresh,
  };
};
