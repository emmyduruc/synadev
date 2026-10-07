import type { CyclePhaseSnapshotDto } from '@syna/shared-types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect } from 'react';

import { getCyclePhase } from '@/lib/api';
import { subscribePeriodDatesChanged } from '@/lib/period/periodDatesEvents';
import { queryKeys } from '@/lib/query/queryKeys';

/**
 * Loads cycle phase via TanStack Query. Soft-refetches on focus / period changes.
 */
export const useCyclePhase = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.cycle.phase(),
    queryFn: (): Promise<CyclePhaseSnapshotDto> => getCyclePhase(),
  });

  const { refetch } = query;

  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  useEffect(
    () =>
      subscribePeriodDatesChanged(() => {
        void queryClient.invalidateQueries({ queryKey: queryKeys.cycle.phase() });
      }),
    [queryClient],
  );

  return {
    snapshot: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refresh,
  };
};
