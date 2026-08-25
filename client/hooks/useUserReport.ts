import { useMemo } from 'react';

import { useBioData } from '@/hooks/useBioData';
import { useMoodLog } from '@/hooks/useMoodLog';
import { usePatternsDashboard } from '@/hooks/usePatternsDashboard';
import { useSymptomLog } from '@/hooks/useSymptomLog';
import { addDaysToKey } from '@/lib/date/dateKeys';
import { buildUserReport } from '@/lib/report/buildUserReport';
import { REPORT_WINDOW_DAYS } from '@/lib/report/reportConstants';
import type { UserReportViewModel } from '@/lib/report/userReportTypes';

export const useUserReport = (): {
  isLoading: boolean;
  report: UserReportViewModel | null;
  refresh: () => void;
} => {
  const { bioData, isLoading: isBioLoading } = useBioData();
  const {
    isLoading: isPatternsLoading,
    computation,
    healthByDate,
    chartWindow,
    mrsLatest,
    refresh,
  } = usePatternsDashboard();
  const { logs: symptomLogs, isLoading: isSymptomLoading } = useSymptomLog();
  const { logs: moodLogs, isLoading: isMoodLoading } = useMoodLog();

  const isLoading =
    isBioLoading || isPatternsLoading || isSymptomLoading || isMoodLoading;

  const report = useMemo(() => {
    if (isLoading || !computation) {
      return null;
    }

    const todayKey = chartWindow.todayKey;
    const windowDays = REPORT_WINDOW_DAYS;
    const fromKey = addDaysToKey(todayKey, -(windowDays - 1));
    const dateKeys: string[] = [];
    let cursor = fromKey;

    while (cursor <= todayKey) {
      dateKeys.push(cursor);
      cursor = addDaysToKey(cursor, 1);
    }

    const symptomsByDate = new Map<string, readonly string[]>();

    for (const [dateKey, ids] of Object.entries(symptomLogs)) {
      if (dateKey >= fromKey && dateKey <= todayKey) {
        symptomsByDate.set(dateKey, ids);
      }
    }

    const moodsByDate = new Map<
      string,
      { energy: number | null; stress: number | null }
    >();

    for (const [dateKey, entry] of Object.entries(moodLogs)) {
      if (dateKey >= fromKey && dateKey <= todayKey) {
        moodsByDate.set(dateKey, {
          energy: entry.energy,
          stress: entry.stress,
        });
      }
    }

    const sleepByDate = new Map<string, { sleepHours: number | null }>();

    for (const dateKey of dateKeys) {
      sleepByDate.set(dateKey, {
        sleepHours: healthByDate.get(dateKey)?.sleepHours ?? null,
      });
    }

    return buildUserReport({
      firstName: bioData.firstName || null,
      windowDays,
      dateKeys,
      symptomsByDate,
      moodsByDate,
      healthByDate: sleepByDate,
      contexts: computation.contexts,
      mrsTotal: mrsLatest?.total ?? null,
    });
  }, [
    bioData.firstName,
    chartWindow.todayKey,
    computation,
    healthByDate,
    isLoading,
    moodLogs,
    mrsLatest?.total,
    symptomLogs,
  ]);

  return {
    isLoading,
    report,
    refresh,
  };
};
