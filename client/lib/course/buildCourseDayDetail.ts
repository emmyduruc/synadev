import type {
  HealthDailyMetricRow,
  SymptomDayEntry,
  SymptomId,
  SymptomLogMap,
} from '@syna/shared-types';
import { HEALTH_METRIC_KEY } from '@syna/shared-types';

import { formatReportDateKey } from '@/lib/report/reportDateRange';
import { findSymptomOption } from '@/lib/symptoms/symptomEntryHelpers';
import { getSymptomExtrasQuestions } from '@/lib/symptoms/symptomExtrasConfig';

const NIGHT_SYMPTOM_IDS = new Set<string>([
  'hot_flashes',
  'night_sweats',
  'nocturia',
  'sleep_maintenance',
  'insomnia',
]);

export type CourseDayDetail = {
  dateKey: string;
  displayDate: string;
  nightSymptomLabelKeys: string[];
  daySymptomLabelKeys: string[];
  awokeLabelKey: string | null;
  sleepTotalHours: number | null;
  deepSleepHours: number | null;
  nightHeartRateBpm: number | null;
  isBleeding: boolean;
  hasContent: boolean;
};

const isNightHotFlashEntry = (entry: SymptomDayEntry): boolean => {
  const wokeNight = entry.extras?.woke_night;

  return wokeNight !== 'no';
};

const isNightSymptom = (entry: SymptomDayEntry): boolean => {
  if (entry.symptomId === 'hot_flashes') {
    return isNightHotFlashEntry(entry);
  }

  return NIGHT_SYMPTOM_IDS.has(entry.symptomId);
};

const labelKeyForSymptom = (symptomId: SymptomId): string => {
  const option = findSymptomOption(symptomId);

  return option?.labelKey ?? symptomId;
};

const awokeLabelKeyFromEntry = (entry: SymptomDayEntry | undefined): string | null => {
  if (!entry?.extras) {
    return null;
  }

  const timesAwoken = entry.extras.times_awoken;

  if (typeof timesAwoken !== 'string' || timesAwoken.length === 0) {
    return null;
  }

  const question = getSymptomExtrasQuestions('sleep_maintenance').find(
    (item) => item.key === 'times_awoken',
  );
  const option = question?.options?.find((item) => item.value === timesAwoken);

  return option?.labelKey ?? null;
};

const metricHours = (
  row: HealthDailyMetricRow | undefined,
  key: typeof HEALTH_METRIC_KEY.sleepAnalysis | typeof HEALTH_METRIC_KEY.sleepSessions | typeof HEALTH_METRIC_KEY.deepSleep,
): number | null => {
  const metric = row?.metrics[key];

  if (!metric || metric.value === null || !Number.isFinite(metric.value)) {
    return null;
  }

  return metric.value;
};

const metricBpm = (row: HealthDailyMetricRow | undefined): number | null => {
  const metric = row?.metrics[HEALTH_METRIC_KEY.nightHeartRate];

  if (!metric || metric.value === null || !Number.isFinite(metric.value)) {
    return null;
  }

  return metric.value;
};

export const formatCourseDurationHours = (hours: number): string => {
  const totalMinutes = Math.max(0, Math.round(hours * 60));
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  return `${h} h ${m} min`;
};

export const formatCourseDurationMinutes = (hours: number): string => {
  const totalMinutes = Math.max(0, Math.round(hours * 60));

  return `${totalMinutes} min`;
};

export const buildCourseDayDetail = (input: {
  dateKey: string;
  symptomLogs: SymptomLogMap;
  healthRows: readonly HealthDailyMetricRow[];
  periodDateKeys: ReadonlySet<string>;
}): CourseDayDetail => {
  const entries = input.symptomLogs[input.dateKey] ?? [];
  const healthRow = input.healthRows.find((row) => row.dateKey === input.dateKey);
  const nightSymptomLabelKeys: string[] = [];
  const daySymptomLabelKeys: string[] = [];
  let awokeLabelKey: string | null = null;

  for (const entry of entries) {
    if (entry.symptomId === 'sleep_maintenance') {
      awokeLabelKey = awokeLabelKeyFromEntry(entry);
    }

    if (isNightSymptom(entry)) {
      nightSymptomLabelKeys.push(labelKeyForSymptom(entry.symptomId));
      continue;
    }

    daySymptomLabelKeys.push(labelKeyForSymptom(entry.symptomId));
  }

  const sleepAnalysis = metricHours(healthRow, HEALTH_METRIC_KEY.sleepAnalysis);
  const sleepSessions = metricHours(healthRow, HEALTH_METRIC_KEY.sleepSessions);
  const sleepTotalHours = sleepAnalysis ?? sleepSessions;
  const deepSleepHours = metricHours(healthRow, HEALTH_METRIC_KEY.deepSleep);
  const nightHeartRateBpm = metricBpm(healthRow);
  const isBleeding = input.periodDateKeys.has(input.dateKey);

  const hasContent =
    nightSymptomLabelKeys.length > 0 ||
    daySymptomLabelKeys.length > 0 ||
    awokeLabelKey !== null ||
    sleepTotalHours !== null ||
    deepSleepHours !== null ||
    nightHeartRateBpm !== null ||
    isBleeding;

  return {
    dateKey: input.dateKey,
    displayDate: formatReportDateKey(input.dateKey),
    nightSymptomLabelKeys,
    daySymptomLabelKeys,
    awokeLabelKey,
    sleepTotalHours,
    deepSleepHours,
    nightHeartRateBpm,
    isBleeding,
    hasContent,
  };
};
