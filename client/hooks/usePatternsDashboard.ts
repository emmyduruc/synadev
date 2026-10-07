import type {
  HealthDailyMetricRow,
  MrsIiAssessmentSubmission,
  Pam13AssessmentSubmission,
} from '@syna/shared-types';
import { HEALTH_METRIC_KEY } from '@syna/shared-types';
import {
  computePatterns,
  PATTERN_WINDOW_DAYS,
  type PatternDailyHealth,
  type PatternDailyMood,
  type PatternsComputation,
} from '@syna/shared-utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { useHealthDailyMetrics } from '@/hooks/useHealthDailyMetrics';
import { useLatestMrsIiAssessment } from '@/hooks/useLatestMrsIiAssessment';
import { useMoodLog } from '@/hooks/useMoodLog';
import { usePeriodDates } from '@/hooks/usePeriodDates';
import { useSymptomLog } from '@/hooks/useSymptomLog';
import { getLatestPam13Assessment } from '@/lib/api';
import { addDaysToKey, toDateKey } from '@/lib/date/dateKeys';
import { buildPatternChartSeries } from '@/lib/patterns/buildPatternChartSeries';
import {
  PATTERN_CHART_FUTURE_DAYS,
  PATTERN_CHART_LOOKBACK_DAYS,
} from '@/lib/patterns/patternChartConstants';
import { queryKeys } from '@/lib/query/queryKeys';

const CHALLENGING_MOOD_IDS = new Set([
  'irritable',
  'anxious',
  'sad',
  'swings',
  'overwhelmed',
  'angry',
  'tearful',
  'unmotivated',
  'lonely',
]);

const toHealthDailyMap = (
  rows: readonly HealthDailyMetricRow[],
): Map<string, PatternDailyHealth> => {
  const map = new Map<string, PatternDailyHealth>();

  for (const row of rows) {
    const hrv =
      row.metrics[HEALTH_METRIC_KEY.hrvRmssd]?.value ??
      row.metrics[HEALTH_METRIC_KEY.hrvSdnn]?.value ??
      null;

    map.set(row.dateKey, {
      dateKey: row.dateKey,
      steps: row.metrics[HEALTH_METRIC_KEY.steps]?.value ?? null,
      exerciseMinutes: row.metrics[HEALTH_METRIC_KEY.exerciseMinutes]?.value ?? null,
      sleepHours:
        row.metrics[HEALTH_METRIC_KEY.sleepAnalysis]?.value ??
        row.metrics[HEALTH_METRIC_KEY.sleepSessions]?.value ??
        null,
      hrvMs: hrv,
      restingHr: row.metrics[HEALTH_METRIC_KEY.restingHeartRate]?.value ?? null,
      nightHr: row.metrics[HEALTH_METRIC_KEY.nightHeartRate]?.value ?? null,
      deepSleepHours: row.metrics[HEALTH_METRIC_KEY.deepSleep]?.value ?? null,
    });
  }

  return map;
};

export const usePatternsDashboard = () => {
  const queryClient = useQueryClient();
  const todayKey = toDateKey(new Date());
  const patternFromKey = addDaysToKey(todayKey, -(PATTERN_WINDOW_DAYS - 1));
  const chartFromKey = addDaysToKey(todayKey, -(PATTERN_CHART_LOOKBACK_DAYS - 1));
  const chartToKey = addDaysToKey(todayKey, PATTERN_CHART_FUTURE_DAYS);

  const { dateKeys: periodDateKeys, isLoading: isPeriodLoading } = usePeriodDates();
  const { logs: symptomLogs, isLoading: isSymptomLoading } = useSymptomLog();
  const { logs: moodLogs, isLoading: isMoodLoading } = useMoodLog();
  const { submission: mrsLatest, isLoading: isMrsLoading } = useLatestMrsIiAssessment();

  const { rows: healthRows, isLoading: isHealthLoading } = useHealthDailyMetrics({
    query: { from: chartFromKey, to: todayKey },
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
    isPeriodLoading ||
    isSymptomLoading ||
    isMoodLoading ||
    isMrsLoading ||
    pamQuery.isLoading ||
    isHealthLoading;

  const computation: PatternsComputation | null = useMemo(() => {
    if (isLoading) {
      return null;
    }

    const symptomsByDate = new Map<string, readonly string[]>();

    for (const [dateKey, entries] of Object.entries(symptomLogs)) {
      symptomsByDate.set(
        dateKey,
        entries.map((entry) => entry.symptomId),
      );
    }

    const moodsByDate = new Map<string, PatternDailyMood>();

    for (const [dateKey, entry] of Object.entries(moodLogs)) {
      moodsByDate.set(dateKey, {
        dateKey,
        energy: entry.energy,
        stress: entry.stress,
        isChallenging: entry.primaryMood
          ? CHALLENGING_MOOD_IDS.has(entry.primaryMood)
          : false,
      });
    }

    return computePatterns({
      asOfDateKey: todayKey,
      periodDateKeys: [...periodDateKeys],
      symptomsByDate,
      moodsByDate,
      healthByDate: toHealthDailyMap(healthRows),
    });
  }, [healthRows, isLoading, moodLogs, periodDateKeys, symptomLogs, todayKey]);

  const chartSeries = useMemo(() => {
    if (isLoading) {
      return [];
    }

    const symptomsByDate = new Map<string, readonly string[]>();

    for (const [dateKey, entries] of Object.entries(symptomLogs)) {
      symptomsByDate.set(
        dateKey,
        entries.map((entry) => entry.symptomId),
      );
    }

    const moodsByDate = new Map<string, PatternDailyMood>();

    for (const [dateKey, entry] of Object.entries(moodLogs)) {
      moodsByDate.set(dateKey, {
        dateKey,
        energy: entry.energy,
        stress: entry.stress,
        isChallenging: entry.primaryMood
          ? CHALLENGING_MOOD_IDS.has(entry.primaryMood)
          : false,
      });
    }

    const dateKeys: string[] = [];
    let cursor = chartFromKey;

    while (cursor <= chartToKey) {
      dateKeys.push(cursor);
      cursor = addDaysToKey(cursor, 1);
    }

    return buildPatternChartSeries({
      dateKeys,
      healthByDate: toHealthDailyMap(healthRows),
      moodsByDate,
      symptomsByDate,
    });
  }, [chartFromKey, chartToKey, healthRows, isLoading, moodLogs, symptomLogs]);

  const healthByDate = useMemo(() => toHealthDailyMap(healthRows), [healthRows]);

  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.health.all });
    void queryClient.invalidateQueries({
      queryKey: queryKeys.assessments.pamLatest(),
    });
  }, [queryClient]);

  return {
    isLoading,
    computation,
    chartSeries,
    healthByDate,
    chartWindow: {
      from: chartFromKey,
      to: chartToKey,
      todayKey,
      patternFrom: patternFromKey,
    },
    mrsLatest: mrsLatest as MrsIiAssessmentSubmission | null,
    pamLatest: pamQuery.data ?? null,
    refresh,
  };
};
