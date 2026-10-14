import type { PeriodDay, PeriodDays } from '@syna/shared-types';
import { createEmptyPeriodDay } from '@syna/shared-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';

import { getPeriodDays, replacePeriodDays } from '@/lib/api';
import {
  emitPeriodDatesChanged,
  subscribePeriodDatesChanged,
} from '@/lib/period/periodDatesEvents';
import { queryKeys } from '@/lib/query/queryKeys';

const toCachePayload = (payload: PeriodDays): PeriodDays => ({
  dateKeys: [...payload.dateKeys].sort(),
  days: [...payload.days].sort((a, b) => a.dateKey.localeCompare(b.dateKey)),
});

const mergeDateKeysWithDays = (
  nextDateKeys: ReadonlySet<string>,
  currentDays: readonly PeriodDay[],
): PeriodDay[] => {
  const byDate = new Map(currentDays.map((day) => [day.dateKey, day]));

  return [...nextDateKeys]
    .sort()
    .map((dateKey) => byDate.get(dateKey) ?? createEmptyPeriodDay(dateKey));
};

export const usePeriodDates = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.period.days(),
    queryFn: async (): Promise<PeriodDays> => {
      const payload = await getPeriodDays();
      return toCachePayload(payload);
    },
  });

  const mutation = useMutation({
    mutationFn: async (
      input:
        | { days: readonly PeriodDay[] }
        | { dateKeys: ReadonlySet<string> },
    ) => {
      if ('days' in input) {
        return toCachePayload(
          await replacePeriodDays({ days: [...input.days] }),
        );
      }

      const sorted = [...new Set(input.dateKeys)].sort();
      return toCachePayload(await replacePeriodDays({ dateKeys: sorted }));
    },
    onSuccess: async (saved) => {
      // Cancel in-flight GETs so a slow refetch cannot overwrite this save.
      await queryClient.cancelQueries({ queryKey: queryKeys.period.days() });
      queryClient.setQueryData(queryKeys.period.days(), saved);
      void queryClient.invalidateQueries({ queryKey: queryKeys.cycle.phase() });
      emitPeriodDatesChanged();
    },
  });

  const days = useMemo(() => query.data?.days ?? [], [query.data?.days]);

  const daysByDate = useMemo(() => {
    const map = new Map<string, PeriodDay>();
    for (const day of days) {
      map.set(day.dateKey, day);
    }
    return map;
  }, [days]);

  const dateKeys = useMemo(
    () => new Set(query.data?.dateKeys ?? days.map((day) => day.dateKey)),
    [days, query.data?.dateKeys],
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
        // Period days cache is already set by the mutation. Only refresh derived cycle phase.
        void queryClient.invalidateQueries({ queryKey: queryKeys.cycle.phase() });
      }),
    [queryClient],
  );

  const setDateKeys = useCallback(
    (next: Set<string> | ((previous: Set<string>) => Set<string>)) => {
      const resolved = typeof next === 'function' ? next(dateKeys) : next;
      const nextDays = mergeDateKeysWithDays(resolved, days);
      queryClient.setQueryData(
        queryKeys.period.days(),
        toCachePayload({
          dateKeys: [...resolved].sort(),
          days: nextDays,
        }),
      );
    },
    [dateKeys, days, queryClient],
  );

  const persist = useCallback(
    async (nextDateKeys: ReadonlySet<string>) => {
      const saved = await mutation.mutateAsync({ dateKeys: nextDateKeys });
      return new Set(saved.dateKeys);
    },
    [mutation],
  );

  const persistDays = useCallback(
    async (nextDays: readonly PeriodDay[]) => {
      const saved = await mutation.mutateAsync({ days: nextDays });
      return saved.days;
    },
    [mutation],
  );

  return {
    dateKeys,
    days,
    daysByDate,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refresh,
    persist,
    persistDays,
    setDateKeys,
  };
};
