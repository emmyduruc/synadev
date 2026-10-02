import { useMemo } from 'react';

import { useSymptomLog } from '@/hooks/useSymptomLog';
import { buildCourseFrequencySummary } from '@/lib/course/courseFrequencies';

export const useCourseFrequencies = () => {
  const { logs, isLoading } = useSymptomLog();

  const summary = useMemo(() => buildCourseFrequencySummary(logs), [logs]);

  return { summary, isLoading };
};
