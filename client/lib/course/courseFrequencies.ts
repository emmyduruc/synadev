import type { SymptomId, SymptomLogMap } from '@syna/shared-types';

import { addDaysToKey, toDateKey } from '@/lib/date/dateKeys';

export const COURSE_FREQUENCY_WINDOW_DAYS = 28;
export const COURSE_FREQUENCY_TILE_COUNT = 10;

export const COURSE_FREQUENCY_SYMPTOM_IDS = [
  'fatigue',
  'breast_tenderness',
  'nocturia',
  'hot_flashes',
] as const satisfies readonly SymptomId[];

export type CourseFrequencySymptomId = (typeof COURSE_FREQUENCY_SYMPTOM_IDS)[number];

export type CourseFrequencyUnit = 'days' | 'nights';

export type CourseFrequencyRow = {
  symptomId: CourseFrequencySymptomId;
  labelKey: string;
  occurrenceDays: number;
  documentedDays: number;
  filledTiles: number;
  unit: CourseFrequencyUnit;
};

export type CourseFrequencySummary = {
  windowDays: number;
  documentedDays: number;
  emptyDays: number;
  rows: CourseFrequencyRow[];
};

const FREQUENCY_LABEL_KEY: Record<CourseFrequencySymptomId, string> = {
  fatigue: 'course_frequency_exhaustion',
  breast_tenderness: 'course_frequency_breast_tenderness',
  nocturia: 'course_frequency_nocturia',
  hot_flashes: 'course_frequency_hot_flashes',
};

const FREQUENCY_UNIT: Record<CourseFrequencySymptomId, CourseFrequencyUnit> = {
  fatigue: 'days',
  breast_tenderness: 'days',
  nocturia: 'nights',
  hot_flashes: 'days',
};

const buildWindowDateKeys = (referenceDate: Date): string[] => {
  const endKey = toDateKey(referenceDate);
  const keys: string[] = [];

  for (let offset = COURSE_FREQUENCY_WINDOW_DAYS - 1; offset >= 0; offset -= 1) {
    keys.push(addDaysToKey(endKey, -offset));
  }

  return keys;
};

const countFilledTiles = (occurrenceDays: number, documentedDays: number): number => {
  if (documentedDays <= 0 || occurrenceDays <= 0) {
    return 0;
  }

  return Math.min(
    COURSE_FREQUENCY_TILE_COUNT,
    Math.max(0, Math.round((occurrenceDays / documentedDays) * COURSE_FREQUENCY_TILE_COUNT)),
  );
};

export const buildCourseFrequencySummary = (
  logs: SymptomLogMap,
  referenceDate: Date = new Date(),
): CourseFrequencySummary => {
  const windowKeys = buildWindowDateKeys(referenceDate);

  let documentedDays = 0;
  const occurrenceBySymptom = new Map<CourseFrequencySymptomId, number>(
    COURSE_FREQUENCY_SYMPTOM_IDS.map((id) => [id, 0]),
  );

  for (const dateKey of windowKeys) {
    const entries = logs[dateKey];

    if (!entries || entries.length === 0) {
      continue;
    }

    documentedDays += 1;

    const presentIds = new Set(entries.map((entry) => entry.symptomId));

    for (const symptomId of COURSE_FREQUENCY_SYMPTOM_IDS) {
      if (presentIds.has(symptomId)) {
        occurrenceBySymptom.set(
          symptomId,
          (occurrenceBySymptom.get(symptomId) ?? 0) + 1,
        );
      }
    }
  }

  const rows: CourseFrequencyRow[] = COURSE_FREQUENCY_SYMPTOM_IDS.map((symptomId) => {
    const occurrenceDays = occurrenceBySymptom.get(symptomId) ?? 0;

    return {
      symptomId,
      labelKey: FREQUENCY_LABEL_KEY[symptomId],
      occurrenceDays,
      documentedDays,
      filledTiles: countFilledTiles(occurrenceDays, documentedDays),
      unit: FREQUENCY_UNIT[symptomId],
    };
  });

  return {
    windowDays: COURSE_FREQUENCY_WINDOW_DAYS,
    documentedDays,
    emptyDays: COURSE_FREQUENCY_WINDOW_DAYS - documentedDays,
    rows,
  };
};
