import type {
  HealthDailyMetricRow,
  MoodEntry,
  MoodId,
  MoodLogMap,
  SymptomDayEntry,
  SymptomId,
  SymptomIntensity,
  SymptomLogMap,
} from '@syna/shared-types';
import { HEALTH_METRIC_KEY, MOOD_SCALE_MAX } from '@syna/shared-types';
import { CYCLE_DAY_MARKER, type CycleDayMarker } from '@syna/shared-utils';

import {
  formatCourseDurationHours,
  formatCourseDurationMinutes,
} from '@/lib/course/buildCourseDayDetail';
import { MOOD_OPTIONS } from '@/lib/mood/moodCatalog';
import {
  isMoodEntryEmpty,
  SYMPTOM_ENTRY_MOOD_LABEL_KEY,
  type SymptomEntryMoodId,
} from '@/lib/mood/moodLogStorage';
import { SYMPTOM_INTENSITY_LABEL_KEYS } from '@/lib/symptoms/symptomEntryConstants';
import { findSymptomOption } from '@/lib/symptoms/symptomEntryHelpers';
import { getSymptomExtrasQuestions } from '@/lib/symptoms/symptomExtrasConfig';

export const CALENDAR_DAY_SUMMARY_SEPARATOR = {
  dot: 'dot',
  colon: 'colon',
} as const;

export type CalendarDaySummarySeparator =
  (typeof CALENDAR_DAY_SUMMARY_SEPARATOR)[keyof typeof CALENDAR_DAY_SUMMARY_SEPARATOR];

export type CalendarDaySummaryLine = {
  id: string;
  separator: CalendarDaySummarySeparator;
  labelKey: string;
  valueKey?: string;
  /** Multiple translation keys joined with ", " in the sheet. */
  valueKeys?: readonly string[];
  valueParams?: Record<string, string | number>;
  valueLiteral?: string;
};

export type CalendarDaySummary = {
  dateKey: string;
  cycleMarker: CycleDayMarker | null;
  entryLines: CalendarDaySummaryLine[];
  healthLines: CalendarDaySummaryLine[];
  hasEntryContent: boolean;
  hasHealthContent: boolean;
};

const CYCLE_MARKER_LABEL_KEY: Record<CycleDayMarker, string> = {
  [CYCLE_DAY_MARKER.period]: 'cycle_insights_legend_period',
  [CYCLE_DAY_MARKER.predictedPeriod]: 'cycle_insights_legend_predicted_period',
  [CYCLE_DAY_MARKER.fertile]: 'cycle_insights_legend_fertile',
  [CYCLE_DAY_MARKER.ovulation]: 'cycle_insights_legend_ovulation',
};

const moodLabelKey = (moodId: MoodId): string => {
  if (moodId in SYMPTOM_ENTRY_MOOD_LABEL_KEY) {
    return SYMPTOM_ENTRY_MOOD_LABEL_KEY[moodId as SymptomEntryMoodId];
  }

  const option = MOOD_OPTIONS.find((item) => item.id === moodId);

  return option?.labelKey ?? moodId;
};

const symptomLabelKey = (symptomId: SymptomId): string => {
  const option = findSymptomOption(symptomId);

  return option?.labelKey ?? symptomId;
};

const intensityLabelKey = (intensity: SymptomIntensity): string =>
  SYMPTOM_INTENSITY_LABEL_KEYS[intensity] ?? SYMPTOM_INTENSITY_LABEL_KEYS[2];

const metricHours = (
  row: HealthDailyMetricRow | undefined,
  key:
    | typeof HEALTH_METRIC_KEY.sleepAnalysis
    | typeof HEALTH_METRIC_KEY.sleepSessions
    | typeof HEALTH_METRIC_KEY.deepSleep,
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

const awokeLineFromEntry = (
  entry: SymptomDayEntry,
): CalendarDaySummaryLine | null => {
  const timesAwoken = entry.extras?.times_awoken;

  if (typeof timesAwoken !== 'string' || timesAwoken.length === 0) {
    return null;
  }

  const question = getSymptomExtrasQuestions('sleep_maintenance').find(
    (item) => item.key === 'times_awoken',
  );
  const option = question?.options?.find((item) => item.value === timesAwoken);

  if (!option) {
    return null;
  }

  return {
    id: `awoke-${entry.symptomId}`,
    separator: CALENDAR_DAY_SUMMARY_SEPARATOR.colon,
    labelKey: 'calendar_day_summary_awoke_label',
    valueKey: option.labelKey,
  };
};

const buildMoodLines = (entry: MoodEntry): CalendarDaySummaryLine[] => {
  if (isMoodEntryEmpty(entry)) {
    return [];
  }

  const lines: CalendarDaySummaryLine[] = [];
  const moodIds: MoodId[] = [];

  if (entry.primaryMood) {
    moodIds.push(entry.primaryMood);
  }

  for (const feeling of entry.feelings) {
    if (!moodIds.includes(feeling)) {
      moodIds.push(feeling);
    }
  }

  if (moodIds.length > 0) {
    lines.push({
      id: 'mood-feelings',
      separator: CALENDAR_DAY_SUMMARY_SEPARATOR.colon,
      labelKey: 'calendar_day_summary_mood_label',
      valueKeys: moodIds.map(moodLabelKey),
    });
  }

  if (entry.energy > 0) {
    lines.push({
      id: 'mood-energy',
      separator: CALENDAR_DAY_SUMMARY_SEPARATOR.colon,
      labelKey: 'symptom_entry_mood_energy_title',
      valueKey: 'symptom_entry_mood_scale_value',
      valueParams: { value: entry.energy, max: MOOD_SCALE_MAX },
    });
  }

  if (entry.stress > 0) {
    lines.push({
      id: 'mood-stress',
      separator: CALENDAR_DAY_SUMMARY_SEPARATOR.colon,
      labelKey: 'symptom_entry_mood_stress_title',
      valueKey: 'symptom_entry_mood_scale_value',
      valueParams: { value: entry.stress, max: MOOD_SCALE_MAX },
    });
  }

  if (entry.medicationChange !== null) {
    lines.push({
      id: 'mood-medication',
      separator: CALENDAR_DAY_SUMMARY_SEPARATOR.colon,
      labelKey: 'symptom_entry_mood_medication_title',
      valueKey: entry.medicationChange
        ? 'symptom_entry_mood_medication_yes'
        : 'symptom_entry_mood_medication_no',
    });
  }

  const note = entry.note.trim();

  if (note.length > 0) {
    lines.push({
      id: 'mood-note',
      separator: CALENDAR_DAY_SUMMARY_SEPARATOR.colon,
      labelKey: 'symptom_entry_mood_note_title',
      valueLiteral: note,
    });
  }

  return lines;
};

export const buildCalendarDaySummary = (input: {
  dateKey: string;
  symptomLogs: SymptomLogMap;
  moodLogs: MoodLogMap;
  healthRows: readonly HealthDailyMetricRow[];
  periodDateKeys: ReadonlySet<string>;
  cycleMarker: CycleDayMarker | null;
}): CalendarDaySummary => {
  const entries = input.symptomLogs[input.dateKey] ?? [];
  const moodEntry = input.moodLogs[input.dateKey];
  const healthRow = input.healthRows.find((row) => row.dateKey === input.dateKey);
  const isBleeding = input.periodDateKeys.has(input.dateKey);
  const entryLines: CalendarDaySummaryLine[] = [];

  if (input.cycleMarker) {
    entryLines.push({
      id: `cycle-${input.cycleMarker}`,
      separator: CALENDAR_DAY_SUMMARY_SEPARATOR.colon,
      labelKey: 'calendar_day_summary_cycle_label',
      valueKey: CYCLE_MARKER_LABEL_KEY[input.cycleMarker],
    });
  }

  entryLines.push({
    id: 'bleeding',
    separator: CALENDAR_DAY_SUMMARY_SEPARATOR.colon,
    labelKey: 'calendar_day_summary_bleeding_label',
    valueKey: isBleeding
      ? 'calendar_day_summary_bleeding_yes'
      : 'calendar_day_summary_bleeding_no',
  });

  for (const entry of entries) {
    const awokeLine = awokeLineFromEntry(entry);

    if (awokeLine) {
      entryLines.push(awokeLine);
    }

    entryLines.push({
      id: `symptom-${entry.symptomId}`,
      separator: CALENDAR_DAY_SUMMARY_SEPARATOR.dot,
      labelKey: symptomLabelKey(entry.symptomId),
      valueKey: intensityLabelKey(entry.intensity as SymptomIntensity),
    });
  }

  if (moodEntry) {
    entryLines.push(...buildMoodLines(moodEntry));
  }

  const healthLines: CalendarDaySummaryLine[] = [];
  const sleepAnalysis = metricHours(healthRow, HEALTH_METRIC_KEY.sleepAnalysis);
  const sleepSessions = metricHours(healthRow, HEALTH_METRIC_KEY.sleepSessions);
  const sleepTotalHours = sleepAnalysis ?? sleepSessions;
  const deepSleepHours = metricHours(healthRow, HEALTH_METRIC_KEY.deepSleep);
  const nightHeartRateBpm = metricBpm(healthRow);

  if (sleepTotalHours !== null) {
    healthLines.push({
      id: 'health-sleep',
      separator: CALENDAR_DAY_SUMMARY_SEPARATOR.colon,
      labelKey: 'calendar_day_summary_health_sleep',
      valueLiteral: formatCourseDurationHours(sleepTotalHours),
    });
  }

  if (deepSleepHours !== null) {
    healthLines.push({
      id: 'health-deep-sleep',
      separator: CALENDAR_DAY_SUMMARY_SEPARATOR.colon,
      labelKey: 'calendar_day_summary_health_deep_sleep',
      valueLiteral: formatCourseDurationMinutes(deepSleepHours),
    });
  }

  if (nightHeartRateBpm !== null) {
    healthLines.push({
      id: 'health-night-hr',
      separator: CALENDAR_DAY_SUMMARY_SEPARATOR.colon,
      labelKey: 'calendar_day_summary_health_night_hr',
      valueLiteral: `${Math.round(nightHeartRateBpm)} bpm`,
    });
  }

  const hasLoggedSymptoms = entries.length > 0;
  const hasLoggedMood = Boolean(moodEntry && !isMoodEntryEmpty(moodEntry));
  const hasCycleContext = input.cycleMarker !== null || isBleeding;

  return {
    dateKey: input.dateKey,
    cycleMarker: input.cycleMarker,
    entryLines,
    healthLines,
    hasEntryContent: hasLoggedSymptoms || hasLoggedMood || hasCycleContext,
    hasHealthContent: healthLines.length > 0,
  };
};
