import { useMemo } from 'react';

import { useHealthDailyMetrics } from '@/hooks/useHealthDailyMetrics';
import { usePeriodDates } from '@/hooks/usePeriodDates';
import { useSymptomLog } from '@/hooks/useSymptomLog';
import {
  buildCourseCooccurrenceSummary,
  COURSE_COOCCURRENCE_WINDOW_DAYS,
} from '@/lib/course/courseCooccurrence';
import { buildCourseFrequencySummary } from '@/lib/course/courseFrequencies';
import { addDaysToKey, toDateKey } from '@/lib/date/dateKeys';

export const useCourseScreenData = () => {
  const { logs: symptomLogs, isLoading: isSymptomLoading } = useSymptomLog();
  const { dateKeys: periodDateKeys, isLoading: isPeriodLoading } = usePeriodDates();

  const to = toDateKey(new Date());
  const from = addDaysToKey(to, -(COURSE_COOCCURRENCE_WINDOW_DAYS - 1));

  const { rows: healthRows, isLoading: isHealthLoading } = useHealthDailyMetrics({
    query: { from, to },
  });

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
