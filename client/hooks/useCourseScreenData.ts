import type { HealthDailyMetricRow } from '@syna/shared-types';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { usePeriodDates } from '@/hooks/usePeriodDates';
import { useSymptomLog } from '@/hooks/useSymptomLog';
import { getHealthDailyMetrics } from '@/lib/api';
import {
  buildCourseCooccurrenceSummary,
  COURSE_COOCCURRENCE_WINDOW_DAYS,
} from '@/lib/course/courseCooccurrence';
import { buildCourseFrequencySummary } from '@/lib/course/courseFrequencies';
import { addDaysToKey, toDateKey } from '@/lib/date/dateKeys';

export const useCourseScreenData = () => {
  const { logs: symptomLogs, isLoading: isSymptomLoading } = useSymptomLog();
  const { dateKeys: periodDateKeys, isLoading: isPeriodLoading } = usePeriodDates();
  const [healthRows, setHealthRows] = useState<HealthDailyMetricRow[]>([]);
  const [isHealthLoading, setIsHealthLoading] = useState(true);

  const refreshHealth = useCallback(async () => {
    setIsHealthLoading(true);
    const to = toDateKey(new Date());
    const from = addDaysToKey(to, -(COURSE_COOCCURRENCE_WINDOW_DAYS - 1));

    try {
      const { rows } = await getHealthDailyMetrics({ from, to });
      setHealthRows(rows);
    } catch {
      setHealthRows([]);
    } finally {
      setIsHealthLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshHealth();
    }, [refreshHealth]),
  );

  const frequencySummary = useMemo(
    () => buildCourseFrequencySummary(symptomLogs),
    [symptomLogs],
  );

  const cooccurrenceSummary = useMemo(
    () =>
      buildCourseCooccurrenceSummary({
        symptomLogs,
        periodDateKeys,
        healthRows,
      }),
    [healthRows, periodDateKeys, symptomLogs],
  );

  return {
    frequencySummary,
    cooccurrenceSummary,
    symptomLogs,
    periodDateKeys,
    healthRows,
    isLoading: isSymptomLoading || isPeriodLoading || isHealthLoading,
  };
};
