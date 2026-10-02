import type {
  HealthDailyMetricRow,
  SymptomDayEntry,
  SymptomLogMap,
} from '@syna/shared-types';
import { HEALTH_METRIC_KEY } from '@syna/shared-types';

import { COURSE_FREQUENCY_WINDOW_DAYS } from '@/lib/course/courseFrequencies';
import { addDaysToKey, toDateKey } from '@/lib/date/dateKeys';

export const COURSE_COOCCURRENCE_WINDOW_DAYS = COURSE_FREQUENCY_WINDOW_DAYS;
export const COURSE_COOCCURRENCE_WEEK_SIZE = 7;

export const COURSE_COOCCURRENCE_ROW_IDS = [
  'night_hot_flashes',
  'night_waking',
  'daytime_exhaustion',
  'deep_sleep',
  'night_heart_rate',
  'bleeding',
] as const;

export type CourseCooccurrenceRowId = (typeof COURSE_COOCCURRENCE_ROW_IDS)[number];

export type CourseCooccurrenceTileKind =
  | 'empty'
  | 'noted'
  | 'weaker'
  | 'watch'
  | 'watch_light'
  | 'bleeding';

export type CourseCooccurrenceTile = {
  dateKey: string;
  kind: CourseCooccurrenceTileKind;
};

export type CourseCooccurrenceRow = {
  id: CourseCooccurrenceRowId;
  labelKey: string;
  tiles: CourseCooccurrenceTile[];
};

export type CourseCooccurrenceSummary = {
  windowDays: number;
  dateKeys: string[];
  rows: CourseCooccurrenceRow[];
};

const ROW_LABEL_KEY: Record<CourseCooccurrenceRowId, string> = {
  night_hot_flashes: 'course_cooccurrence_row_night_hot_flashes',
  night_waking: 'course_cooccurrence_row_night_waking',
  daytime_exhaustion: 'course_cooccurrence_row_daytime_exhaustion',
  deep_sleep: 'course_cooccurrence_row_deep_sleep',
  night_heart_rate: 'course_cooccurrence_row_night_heart_rate',
  bleeding: 'course_cooccurrence_row_bleeding',
};

const WEAKER_INTENSITY_MAX = 1;

const buildWindowDateKeys = (referenceDate: Date): string[] => {
  const endKey = toDateKey(referenceDate);
  const keys: string[] = [];

  for (let offset = COURSE_COOCCURRENCE_WINDOW_DAYS - 1; offset >= 0; offset -= 1) {
    keys.push(addDaysToKey(endKey, -offset));
  }

  return keys;
};

const findEntry = (
  logs: SymptomLogMap,
  dateKey: string,
  symptomId: string,
): SymptomDayEntry | undefined =>
  logs[dateKey]?.find((entry) => entry.symptomId === symptomId);

const isNightHotFlash = (entry: SymptomDayEntry | undefined): boolean => {
  if (!entry) {
    return false;
  }

  const wokeNight = entry.extras?.woke_night;

  if (wokeNight === 'no') {
    return false;
  }

  return true;
};

const notedOrWeaker = (entry: SymptomDayEntry | undefined): CourseCooccurrenceTileKind => {
  if (!entry) {
    return 'empty';
  }

  if (entry.intensity <= WEAKER_INTENSITY_MAX) {
    return 'weaker';
  }

  return 'noted';
};

const metricValueByDate = (
  rows: readonly HealthDailyMetricRow[],
  metricKey:
    | typeof HEALTH_METRIC_KEY.deepSleep
    | typeof HEALTH_METRIC_KEY.nightHeartRate,
): Map<string, number> => {
  const map = new Map<string, number>();

  for (const row of rows) {
    const metric = row.metrics[metricKey];

    if (metric && metric.value !== null && Number.isFinite(metric.value)) {
      map.set(row.dateKey, metric.value);
    }
  }

  return map;
};

const median = (values: readonly number[]): number | null => {
  if (values.length === 0) {
    return null;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }

  return sorted[mid];
};

const watchKindForValue = (
  value: number | undefined,
  medianValue: number | null,
): CourseCooccurrenceTileKind => {
  if (value === undefined) {
    return 'empty';
  }

  if (medianValue === null) {
    return 'watch';
  }

  return value >= medianValue ? 'watch' : 'watch_light';
};

export const buildCourseCooccurrenceSummary = (input: {
  symptomLogs: SymptomLogMap;
  periodDateKeys: ReadonlySet<string>;
  healthRows: readonly HealthDailyMetricRow[];
  referenceDate?: Date;
}): CourseCooccurrenceSummary => {
  const dateKeys = buildWindowDateKeys(input.referenceDate ?? new Date());
  const deepSleepByDate = metricValueByDate(input.healthRows, HEALTH_METRIC_KEY.deepSleep);
  const nightHrByDate = metricValueByDate(
    input.healthRows,
    HEALTH_METRIC_KEY.nightHeartRate,
  );
  const deepSleepMedian = median([...deepSleepByDate.values()]);
  const nightHrMedian = median([...nightHrByDate.values()]);

  const buildSymptomTiles = (
    resolve: (dateKey: string) => CourseCooccurrenceTileKind,
  ): CourseCooccurrenceTile[] =>
    dateKeys.map((dateKey) => ({
      dateKey,
      kind: resolve(dateKey),
    }));

  const rows: CourseCooccurrenceRow[] = [
    {
      id: 'night_hot_flashes',
      labelKey: ROW_LABEL_KEY.night_hot_flashes,
      tiles: buildSymptomTiles((dateKey) => {
        const entry = findEntry(input.symptomLogs, dateKey, 'hot_flashes');

        if (!isNightHotFlash(entry)) {
          return 'empty';
        }

        return notedOrWeaker(entry);
      }),
    },
    {
      id: 'night_waking',
      labelKey: ROW_LABEL_KEY.night_waking,
      tiles: buildSymptomTiles((dateKey) =>
        notedOrWeaker(findEntry(input.symptomLogs, dateKey, 'sleep_maintenance')),
      ),
    },
    {
      id: 'daytime_exhaustion',
      labelKey: ROW_LABEL_KEY.daytime_exhaustion,
      tiles: buildSymptomTiles((dateKey) =>
        notedOrWeaker(findEntry(input.symptomLogs, dateKey, 'fatigue')),
      ),
    },
    {
      id: 'deep_sleep',
      labelKey: ROW_LABEL_KEY.deep_sleep,
      tiles: buildSymptomTiles((dateKey) =>
        watchKindForValue(deepSleepByDate.get(dateKey), deepSleepMedian),
      ),
    },
    {
      id: 'night_heart_rate',
      labelKey: ROW_LABEL_KEY.night_heart_rate,
      tiles: buildSymptomTiles((dateKey) =>
        watchKindForValue(nightHrByDate.get(dateKey), nightHrMedian),
      ),
    },
    {
      id: 'bleeding',
      labelKey: ROW_LABEL_KEY.bleeding,
      tiles: buildSymptomTiles((dateKey) =>
        input.periodDateKeys.has(dateKey) ? 'bleeding' : 'empty',
      ),
    },
  ];

  return {
    windowDays: COURSE_COOCCURRENCE_WINDOW_DAYS,
    dateKeys,
    rows,
  };
};
