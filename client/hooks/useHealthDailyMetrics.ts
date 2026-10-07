import type { GetHealthDailyMetricsQuery, HealthDailyMetricRow } from '@syna/shared-types';
import { useQuery } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { getHealthDailyMetrics } from '@/lib/api';
import { queryKeys } from '@/lib/query/queryKeys';

export type UseHealthDailyMetricsOptions = {
  query: GetHealthDailyMetricsQuery;
  enabled?: boolean;
  refetchOnFocus?: boolean;
};

export const useHealthDailyMetrics = ({
  query,
  enabled = true,
  refetchOnFocus = true,
}: UseHealthDailyMetricsOptions) => {
  const healthQuery = useQuery({
    queryKey: queryKeys.health.daily(query),
    queryFn: async (): Promise<HealthDailyMetricRow[]> => {
      const { rows } = await getHealthDailyMetrics(query);
      return rows;
    },
    enabled,
    placeholderData: (previous) => previous,
  });

  const { refetch } = healthQuery;

  useFocusEffect(
    useCallback(() => {
      if (!refetchOnFocus || !enabled) {
        return;
      }

      void refetch();
    }, [enabled, refetch, refetchOnFocus]),
  );

  return {
    rows: healthQuery.data ?? [],
    isLoading: healthQuery.isLoading,
    isFetching: healthQuery.isFetching,
    refetch,
  };
};
