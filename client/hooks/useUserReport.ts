import { useMemo } from 'react';

import { useBioData } from '@/hooks/useBioData';
import { useMoodLog } from '@/hooks/useMoodLog';
import { usePatternsDashboard } from '@/hooks/usePatternsDashboard';
import { useSymptomLog } from '@/hooks/useSymptomLog';
import { buildUserReport } from '@/lib/report/buildUserReport';
import {
  buildDateKeysInclusive,
  countInclusiveDays,
  type ReportDateRange,
} from '@/lib/report/reportDateRange';
import type { UserReportViewModel } from '@/lib/report/userReportTypes';

export type UseUserReportOptions = {
  range: ReportDateRange;
};

export const useUserReport = ({
  range,
}: UseUserReportOptions): {
  isLoading: boolean;
  report: UserReportViewModel | null;
  refresh: () => void;
} => {
  const { bioData, isLoading: isBioLoading } = useBioData();
  const {
    isLoading: isPatternsLoading,
    computation,
    healthByDate,
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

    const fromKey = range.fromDateKey;
    const toKey = range.toDateKey;
    const dateKeys = buildDateKeysInclusive(fromKey, toKey);
    const windowDays = countInclusiveDays(fromKey, toKey);

    const symptomsByDate = new Map<string, readonly string[]>();

    for (const [dateKey, ids] of Object.entries(symptomLogs)) {
      if (dateKey >= fromKey && dateKey <= toKey) {
        symptomsByDate.set(dateKey, ids);
      }
    }

    const moodsByDate = new Map<
      string,
      { energy: number | null; stress: number | null }
    >();

    for (const [dateKey, entry] of Object.entries(moodLogs)) {
      if (dateKey >= fromKey && dateKey <= toKey) {
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
    computation,
    healthByDate,
    isLoading,
    moodLogs,
    mrsLatest?.total,
    range.fromDateKey,
    range.toDateKey,
    symptomLogs,
  ]);

  return {
    isLoading,
    report,
    refresh,
  };
};
