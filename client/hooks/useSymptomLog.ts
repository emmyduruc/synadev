import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect } from 'react';

import { getSymptomLogs, replaceSymptomLogs } from '@/lib/api';
import { queryKeys } from '@/lib/query/queryKeys';
import {
  emitSymptomLogsChanged,
  subscribeSymptomLogsChanged,
} from '@/lib/symptoms/symptomLogsEvents';
import type { SymptomLogMap } from '@/lib/symptoms/symptomLogStorage';

export type UseSymptomLogOptions = {
  enabled?: boolean;
  refetchOnFocus?: boolean;
};

/**
 * Loads symptom logs via TanStack Query (shared in-memory cache).
 * Soft-refetches on focus / peer events without blanking cached data.
 */
export const useSymptomLog = (options: UseSymptomLogOptions = {}) => {
  const { enabled = true, refetchOnFocus = true } = options;
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.symptoms.logs(),
    queryFn: async (): Promise<SymptomLogMap> => {
      const { logs } = await getSymptomLogs();
      return logs;
    },
    enabled,
    placeholderData: (previous) => previous,
  });

  const mutation = useMutation({
    mutationFn: async (nextLogs: SymptomLogMap) => {
      const { logs: saved } = await replaceSymptomLogs({ logs: nextLogs });
      return saved;
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(queryKeys.symptoms.logs(), saved);
      emitSymptomLogsChanged();
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
      subscribeSymptomLogsChanged(() => {
        void queryClient.invalidateQueries({ queryKey: queryKeys.symptoms.logs() });
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
