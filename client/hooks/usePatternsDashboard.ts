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
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useMoodLog } from '@/hooks/useMoodLog';
import { useMrsIiAssessmentStatus } from '@/hooks/useMrsIiAssessmentStatus';
import { usePeriodDates } from '@/hooks/usePeriodDates';
import { useSymptomLog } from '@/hooks/useSymptomLog';
import { getHealthDailyMetrics, getLatestPam13Assessment } from '@/lib/api';
import { addDaysToKey, toDateKey } from '@/lib/date/dateKeys';
import { buildPatternChartSeries } from '@/lib/patterns/buildPatternChartSeries';
import {
  PATTERN_CHART_FUTURE_DAYS,
  PATTERN_CHART_LOOKBACK_DAYS,
} from '@/lib/patterns/patternChartConstants';

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
  const todayKey = toDateKey(new Date());
  const patternFromKey = addDaysToKey(todayKey, -(PATTERN_WINDOW_DAYS - 1));
  const chartFromKey = addDaysToKey(todayKey, -(PATTERN_CHART_LOOKBACK_DAYS - 1));
  const chartToKey = addDaysToKey(todayKey, PATTERN_CHART_FUTURE_DAYS);

  const { dateKeys: periodDateKeys, isLoading: isPeriodLoading } = usePeriodDates();
  const { logs: symptomLogs, isLoading: isSymptomLoading } = useSymptomLog();
  const { logs: moodLogs, isLoading: isMoodLoading } = useMoodLog();
  const { latestSubmission: mrsLatest, isLoading: isMrsLoading } =
    useMrsIiAssessmentStatus();

  const [pamLatest, setPamLatest] = useState<Pam13AssessmentSubmission | null>(null);
  const [isPamLoading, setIsPamLoading] = useState(true);
  const [healthRows, setHealthRows] = useState<HealthDailyMetricRow[]>([]);
  const [isHealthLoading, setIsHealthLoading] = useState(true);

  const refreshHealthAndPam = useCallback(async () => {
    setIsHealthLoading(true);
    setIsPamLoading(true);

    try {
      const [healthResult, pamResult] = await Promise.all([
        getHealthDailyMetrics({ from: chartFromKey, to: todayKey }),
        getLatestPam13Assessment(),
      ]);
      setHealthRows(healthResult.rows);
      setPamLatest(pamResult.submission);
    } catch {
      setHealthRows([]);
      setPamLatest(null);
    } finally {
      setIsHealthLoading(false);
      setIsPamLoading(false);
    }
  }, [chartFromKey, todayKey]);

  useEffect(() => {
    void refreshHealthAndPam();
  }, [refreshHealthAndPam]);

  const isLoading =
    isPeriodLoading ||
    isSymptomLoading ||
    isMoodLoading ||
    isMrsLoading ||
    isPamLoading ||
    isHealthLoading;

  const computation: PatternsComputation | null = useMemo(() => {
    if (isLoading) {
      return null;
    }

    const symptomsByDate = new Map<string, readonly string[]>();

    for (const [dateKey, ids] of Object.entries(symptomLogs)) {
      symptomsByDate.set(dateKey, ids);
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

    for (const [dateKey, ids] of Object.entries(symptomLogs)) {
      symptomsByDate.set(dateKey, ids);
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

  return {
    isLoading,
    computation,
    chartSeries,
    chartWindow: {
      from: chartFromKey,
      to: chartToKey,
      todayKey,
      patternFrom: patternFromKey,
    },
    mrsLatest: mrsLatest as MrsIiAssessmentSubmission | null,
    pamLatest,
    refresh: () => {
      void refreshHealthAndPam();
    },
  };
};
