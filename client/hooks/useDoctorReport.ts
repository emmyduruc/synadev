import { useMemo } from 'react';

import { useBioData } from '@/hooks/useBioData';
import { useHealthRecord } from '@/hooks/useHealthRecord';
import { useLatestMrsIiAssessment } from '@/hooks/useLatestMrsIiAssessment';
import { useLatestPhq2Assessment } from '@/hooks/useLatestPhq2Assessment';
import { useMoodLog } from '@/hooks/useMoodLog';
import { usePatternsDashboard } from '@/hooks/usePatternsDashboard';
import { useSymptomLog } from '@/hooks/useSymptomLog';
import { buildPatternChartSeries } from '@/lib/patterns/buildPatternChartSeries';
import { buildDoctorReport } from '@/lib/report/buildDoctorReport';
import type { DoctorReportViewModel } from '@/lib/report/doctorReportTypes';
import {
  buildDateKeysInclusive,
  countInclusiveDays,
  type ReportDateRange,
} from '@/lib/report/reportDateRange';

export type UseDoctorReportOptions = {
  range: ReportDateRange;
};

export const useDoctorReport = ({
  range,
}: UseDoctorReportOptions): {
  isLoading: boolean;
  report: DoctorReportViewModel | null;
  refresh: () => void;
} => {
  const { bioData, isLoading: isBioLoading } = useBioData();
  const { record: healthRecord, isLoading: isHealthRecordLoading } = useHealthRecord();
  const { submission: phq2Latest, isLoading: isPhq2Loading } = useLatestPhq2Assessment();
  const { submission: mrsLatest, isLoading: isMrsLoading, refresh: refreshMrs } =
    useLatestMrsIiAssessment();
  const {
    isLoading: isPatternsLoading,
    computation,
    healthByDate,
    pamLatest,
    refresh: refreshPatterns,
  } = usePatternsDashboard();
  const { logs: symptomLogs, isLoading: isSymptomLoading } = useSymptomLog();
  const { logs: moodLogs, isLoading: isMoodLoading } = useMoodLog();

  const isLoading =
    isBioLoading ||
    isPatternsLoading ||
    isSymptomLoading ||
    isMoodLoading ||
    isHealthRecordLoading ||
    isPhq2Loading ||
    isMrsLoading;

  const report = useMemo(() => {
    if (isLoading) {
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

    const healthWindow = new Map<
      string,
      {
        sleepHours: number | null;
        steps: number | null;
        hrvMs: number | null;
        nightHr: number | null;
        deepSleepHours: number | null;
        exerciseMinutes: number | null;
      }
    >();

    for (const dateKey of dateKeys) {
      const row = healthByDate.get(dateKey);

      healthWindow.set(dateKey, {
        sleepHours: row?.sleepHours ?? null,
        steps: row?.steps ?? null,
        hrvMs: row?.hrvMs ?? null,
        nightHr: row?.nightHr ?? null,
        deepSleepHours: row?.deepSleepHours ?? null,
        exerciseMinutes: row?.exerciseMinutes ?? null,
      });
    }

    const chartSeries = buildPatternChartSeries({
      dateKeys,
      healthByDate,
      moodsByDate: new Map(
        [...moodsByDate.entries()].map(([dateKey, mood]) => [
          dateKey,
          {
            dateKey,
            energy: mood.energy,
            stress: mood.stress,
            isChallenging: false,
          },
        ]),
      ),
      symptomsByDate,
    });

    return buildDoctorReport({
      firstName: bioData.firstName || null,
      lastName: bioData.lastName || null,
      dateOfBirth: bioData.dateOfBirth || null,
      windowDays,
      dateKeys,
      symptomsByDate,
      moodsByDate,
      healthByDate: healthWindow,
      computation,
      chartSeries,
      heatmap: computation?.heatmap ?? null,
      mrsLatest,
      pamLatest,
      phq2Latest,
      healthRecord,
    });
  }, [
    bioData.dateOfBirth,
    bioData.firstName,
    bioData.lastName,
    computation,
    healthByDate,
    healthRecord,
    isLoading,
    moodLogs,
    mrsLatest,
    pamLatest,
    phq2Latest,
    range.fromDateKey,
    range.toDateKey,
    symptomLogs,
  ]);

  return {
    isLoading,
    report,
    refresh: () => {
      refreshPatterns();
      void refreshMrs();
    },
  };
};
