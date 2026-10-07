import {
  createEmptyReportPreferences,
  type ReportPreferences,
  type UpdateReportPreferences,
} from '@syna/shared-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getReportPreferences, putReportPreferences } from '@/lib/api';
import { queryKeys } from '@/lib/query/queryKeys';

/** Stable empty fallback — never recreate per render. */
const EMPTY_REPORT_PREFERENCES = createEmptyReportPreferences();

export const useReportPreferences = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.report.preferences(),
    queryFn: (): Promise<ReportPreferences> => getReportPreferences(),
  });

  const mutation = useMutation({
    mutationFn: (input: UpdateReportPreferences) => putReportPreferences(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.report.preferences() });
      const previous = queryClient.getQueryData<ReportPreferences>(
        queryKeys.report.preferences(),
      );
      queryClient.setQueryData(queryKeys.report.preferences(), input);
      return { previous };
    },
    onError: (_error, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.report.preferences(), context.previous);
      }
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(queryKeys.report.preferences(), saved);
    },
  });

  const preferences = query.data ?? EMPTY_REPORT_PREFERENCES;

  const savePreferences = useCallback(
    async (next: UpdateReportPreferences) => {
      return mutation.mutateAsync(next);
    },
    [mutation],
  );

  return {
    preferences,
    isLoading: query.isLoading,
    isSaving: mutation.isPending,
    savePreferences,
    refetch: query.refetch,
  };
};
