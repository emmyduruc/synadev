import type { Pam13AssessmentSubmission } from '@syna/shared-types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useCyclePhase } from '@/hooks/useCyclePhase';
import { useHealthDailyMetrics } from '@/hooks/useHealthDailyMetrics';
import { useLatestMrsIiAssessment } from '@/hooks/useLatestMrsIiAssessment';
import { getLatestPam13Assessment } from '@/lib/api';
import { addDaysToKey, toDateKey } from '@/lib/date/dateKeys';
import { buildDashboardInsights } from '@/lib/insights/buildDashboardInsights';
import { DASHBOARD_INSIGHT_HEALTH_WINDOW_DAYS } from '@/lib/insights/constants';
import { queryKeys } from '@/lib/query/queryKeys';

export const useDashboardInsights = () => {
  const { submission: mrsSubmission, isLoading: isMrsLoading } =
    useLatestMrsIiAssessment();
  const { snapshot: cycleSnapshot, isLoading: isCycleLoading } = useCyclePhase();

  const to = toDateKey(new Date());
  const from = addDaysToKey(to, -(DASHBOARD_INSIGHT_HEALTH_WINDOW_DAYS - 1));

  const { rows: healthRows, isLoading: isHealthLoading } = useHealthDailyMetrics({
    query: { from, to },
    refetchOnFocus: false,
  });

  const pamQuery = useQuery({
    queryKey: queryKeys.assessments.pamLatest(),
    queryFn: async (): Promise<Pam13AssessmentSubmission | null> => {
      const latest = await getLatestPam13Assessment();
      return latest.submission;
    },
  });

  const isLoading =
    isMrsLoading || isCycleLoading || isHealthLoading || pamQuery.isLoading;

  const insights = useMemo(() => {
    if (isLoading) {
      return [];
    }

    return buildDashboardInsights({
      mrsSubmission,
      pamSubmission: pamQuery.data ?? null,
      cycleSnapshot,
      healthRows,
    });
  }, [cycleSnapshot, healthRows, isLoading, mrsSubmission, pamQuery.data]);

  return {
    insights,
    isLoading,
  };
};
