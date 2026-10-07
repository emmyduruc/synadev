import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';

import { getPeriodDays, replacePeriodDays } from '@/lib/api';
import {
  emitPeriodDatesChanged,
  subscribePeriodDatesChanged,
} from '@/lib/period/periodDatesEvents';
import { queryKeys } from '@/lib/query/queryKeys';

export const usePeriodDates = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.period.days(),
    queryFn: async (): Promise<string[]> => {
      const { dateKeys } = await getPeriodDays();
      return dateKeys;
    },
  });

  const mutation = useMutation({
    mutationFn: async (nextDateKeys: ReadonlySet<string>) => {
      const sorted = [...new Set(nextDateKeys)].sort();
      const { dateKeys: saved } = await replacePeriodDays({ dateKeys: sorted });
      return saved;
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(queryKeys.period.days(), saved);
      void queryClient.invalidateQueries({ queryKey: queryKeys.cycle.phase() });
      emitPeriodDatesChanged();
    },
  });

  const dateKeys = useMemo(
    () => new Set(query.data ?? []),
    [query.data],
  );

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
        void queryClient.invalidateQueries({ queryKey: queryKeys.period.days() });
        void queryClient.invalidateQueries({ queryKey: queryKeys.cycle.phase() });
      }),
    [queryClient],
  );

  const setDateKeys = useCallback(
    (next: Set<string> | ((previous: Set<string>) => Set<string>)) => {
      const resolved = typeof next === 'function' ? next(dateKeys) : next;
      queryClient.setQueryData(queryKeys.period.days(), [...resolved].sort());
    },
    [dateKeys, queryClient],
  );

  return {
    dateKeys,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refresh,
    persist: mutation.mutateAsync,
    setDateKeys,
  };
};
