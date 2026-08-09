import type { PatternDailyHealth, PatternDailyMood } from '@syna/shared-utils';

import {
  PATTERN_CHART_METRIC,
  PATTERN_CHART_METRIC_ORDER,
  type PatternChartMetricId,
} from '@/lib/patterns/patternChartConstants';

export type PatternChartPoint = {
  dateKey: string;
  value: number | null;
};

export type PatternChartSeries = {
  id: PatternChartMetricId;
  points: PatternChartPoint[];
};

const HEAT_SYMPTOM_IDS = new Set(['hot_flashes', 'night_sweats']);

export const buildPatternChartSeries = (input: {
  dateKeys: readonly string[];
  healthByDate: ReadonlyMap<string, PatternDailyHealth>;
  moodsByDate: ReadonlyMap<string, PatternDailyMood>;
  symptomsByDate: ReadonlyMap<string, readonly string[]>;
}): PatternChartSeries[] => {
  const { dateKeys, healthByDate, moodsByDate, symptomsByDate } = input;

  const valueFor = (
    metricId: PatternChartMetricId,
    dateKey: string,
  ): number | null => {
    if (metricId === PATTERN_CHART_METRIC.sleep) {
      return healthByDate.get(dateKey)?.sleepHours ?? null;
    }

    if (metricId === PATTERN_CHART_METRIC.steps) {
      return healthByDate.get(dateKey)?.steps ?? null;
    }

    if (metricId === PATTERN_CHART_METRIC.exercise) {
      return healthByDate.get(dateKey)?.exerciseMinutes ?? null;
    }

    if (metricId === PATTERN_CHART_METRIC.hrv) {
      return healthByDate.get(dateKey)?.hrvMs ?? null;
    }

    if (metricId === PATTERN_CHART_METRIC.stress) {
      return moodsByDate.get(dateKey)?.stress ?? null;
    }

    if (metricId === PATTERN_CHART_METRIC.energy) {
      return moodsByDate.get(dateKey)?.energy ?? null;
    }

    const symptoms = symptomsByDate.get(dateKey);

    if (!symptoms) {
      return null;
    }

    return symptoms.some((id) => HEAT_SYMPTOM_IDS.has(id)) ? 1 : 0;
  };

  return PATTERN_CHART_METRIC_ORDER.map((metricId) => ({
    id: metricId,
    points: dateKeys.map((dateKey) => ({
      dateKey,
      value: valueFor(metricId, dateKey),
    })),
  }));
};
