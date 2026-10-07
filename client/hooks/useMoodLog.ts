import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect } from 'react';

import { getMoodLogs, replaceMoodLogs } from '@/lib/api';
import {
  emitMoodLogsChanged,
  subscribeMoodLogsChanged,
} from '@/lib/mood/moodLogsEvents';
import type { MoodLogMap } from '@/lib/mood/moodLogStorage';
import { queryKeys } from '@/lib/query/queryKeys';

export type UseMoodLogOptions = {
  enabled?: boolean;
  refetchOnFocus?: boolean;
};

/**
 * Loads mood logs via TanStack Query (shared in-memory cache).
 */
export const useMoodLog = (options: UseMoodLogOptions = {}) => {
  const { enabled = true, refetchOnFocus = true } = options;
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.mood.logs(),
    queryFn: async (): Promise<MoodLogMap> => {
      const { logs } = await getMoodLogs();
      return logs;
    },
    enabled,
    placeholderData: (previous) => previous,
  });

  const mutation = useMutation({
    mutationFn: async (nextLogs: MoodLogMap) => {
      const { logs: saved } = await replaceMoodLogs({ logs: nextLogs });
      return saved;
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(queryKeys.mood.logs(), saved);
      emitMoodLogsChanged();
    },
  });

  const { refetch } = query;

  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  useFocusEffect(
    useCallback(() => {
      if (!enabled || !refetchOnFocus) {
        return;
      }

      void refetch();
    }, [enabled, refetch, refetchOnFocus]),
  );

  useEffect(
    () =>
      subscribeMoodLogsChanged(() => {
        void queryClient.invalidateQueries({ queryKey: queryKeys.mood.logs() });
      }),
    [queryClient],
  );

  return {
    logs: query.data ?? {},
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    persist: mutation.mutateAsync,
    refresh,
  };
};
