import {
  type CourseCooccurrenceRow,
  type CourseCooccurrenceRowId,
  type CourseCooccurrenceSummary,
  type CourseCooccurrenceTileKind,
} from '@/lib/course/courseCooccurrence';
import { addDaysToKey } from '@/lib/date/dateKeys';

export type CourseRowInsightUnit = 'nights' | 'days';

export type CourseRowInsightLine = {
  key: string;
  params: Record<string, string | number>;
};

export type CourseRowInsight = {
  rowId: CourseCooccurrenceRowId;
  labelKey: string;
  shortLabelKey: string;
  eventCount: number;
  unit: CourseRowInsightUnit;
  eventDateKeys: string[];
  lines: CourseRowInsightLine[];
};

const SHORT_LABEL_KEY: Record<CourseCooccurrenceRowId, string> = {
  night_hot_flashes: 'course_row_insight_label_hot_flashes',
  night_waking: 'course_row_insight_label_waking',
  daytime_exhaustion: 'course_row_insight_label_exhaustion',
  deep_sleep: 'course_row_insight_label_deep_sleep',
  night_heart_rate: 'course_row_insight_label_night_hr',
  bleeding: 'course_row_insight_label_bleeding',
};

const isFilled = (kind: CourseCooccurrenceTileKind): boolean => kind !== 'empty';

const ROW_UNIT: Record<CourseCooccurrenceRowId, CourseRowInsightUnit> = {
  night_hot_flashes: 'nights',
  night_waking: 'nights',
  daytime_exhaustion: 'days',
  deep_sleep: 'nights',
  night_heart_rate: 'nights',
  bleeding: 'days',
};

const findRow = (
  summary: CourseCooccurrenceSummary,
  rowId: CourseCooccurrenceRowId,
): CourseCooccurrenceRow | undefined => summary.rows.find((row) => row.id === rowId);

const filledDateKeys = (row: CourseCooccurrenceRow): string[] =>
  row.tiles.filter((tile) => isFilled(tile.kind)).map((tile) => tile.dateKey);

const countOverlap = (
  eventDates: readonly string[],
  otherRow: CourseCooccurrenceRow | undefined,
): number => {
  if (!otherRow || eventDates.length === 0) {
    return 0;
  }

  const otherFilled = new Set(filledDateKeys(otherRow));

  return eventDates.filter((dateKey) => otherFilled.has(dateKey)).length;
};

const countFollowingDayOverlap = (
  eventDates: readonly string[],
  otherRow: CourseCooccurrenceRow | undefined,
): number => {
  if (!otherRow || eventDates.length === 0) {
    return 0;
  }

  const otherFilled = new Set(filledDateKeys(otherRow));

  return eventDates.filter((dateKey) => otherFilled.has(addDaysToKey(dateKey, 1))).length;
};

const countWatchBelowUsual = (
  eventDates: readonly string[],
  watchRow: CourseCooccurrenceRow | undefined,
): number => {
  if (!watchRow || eventDates.length === 0) {
    return 0;
  }

  const byDate = new Map(watchRow.tiles.map((tile) => [tile.dateKey, tile.kind]));

  return eventDates.filter((dateKey) => byDate.get(dateKey) === 'watch_light').length;
};

export const buildCourseRowInsight = (
  summary: CourseCooccurrenceSummary,
  rowId: CourseCooccurrenceRowId,
): CourseRowInsight | null => {
  const selectedRow = findRow(summary, rowId);

  if (!selectedRow) {
    return null;
  }

  const eventDateKeys = filledDateKeys(selectedRow);

  if (eventDateKeys.length === 0) {
    return null;
  }

  const hotFlashesRow = findRow(summary, 'night_hot_flashes');
  const wakingRow = findRow(summary, 'night_waking');
  const exhaustionRow = findRow(summary, 'daytime_exhaustion');
  const deepSleepRow = findRow(summary, 'deep_sleep');
  const nightHrRow = findRow(summary, 'night_heart_rate');
  const eventCount = eventDateKeys.length;

  const candidates: CourseRowInsightLine[] = [];

  if (rowId !== 'deep_sleep') {
    const deepSleepLower = countWatchBelowUsual(eventDateKeys, deepSleepRow);

    if (deepSleepLower > 0) {
      candidates.push({
        key: 'course_row_insight_deep_sleep_lower',
        params: { count: deepSleepLower },
      });
    }
  }

  if (rowId === 'night_hot_flashes' || rowId === 'night_waking') {
    const followingExhaustion = countFollowingDayOverlap(eventDateKeys, exhaustionRow);

    if (followingExhaustion > 0) {
      candidates.push({
        key: 'course_row_insight_exhaustion_following',
        params: { count: followingExhaustion, total: eventCount },
      });
    }
  }

  if (rowId !== 'night_hot_flashes') {
    const hotFlashOverlap = countOverlap(eventDateKeys, hotFlashesRow);

    if (hotFlashOverlap > 0) {
      candidates.push({
        key: 'course_row_insight_hot_flashes_same',
        params: { count: hotFlashOverlap },
      });
    }
  }

  if (rowId !== 'night_waking' && rowId !== 'night_hot_flashes') {
    const wakingOverlap = countOverlap(eventDateKeys, wakingRow);

    if (wakingOverlap > 0) {
      candidates.push({
        key: 'course_row_insight_waking_same',
        params: { count: wakingOverlap },
      });
    }
  }

  if (rowId !== 'night_heart_rate') {
    const nightHrBelow = countWatchBelowUsual(eventDateKeys, nightHrRow);

    if (nightHrBelow > 0) {
      candidates.push({
        key: 'course_row_insight_night_hr_below',
        params: { count: nightHrBelow },
      });
    }
  }

  return {
    rowId,
    labelKey: selectedRow.labelKey,
    shortLabelKey: SHORT_LABEL_KEY[rowId],
    eventCount,
    unit: ROW_UNIT[rowId],
    eventDateKeys,
    lines: candidates.slice(0, 3),
  };
};
