import {
  addDaysToKey,
  fromDateKey as parseDateKey,
  toDateKey as formatDateKey,
} from '@/lib/date/dateKeys';
import {
  DOCTOR_REPORT_WINDOW_DAYS,
  REPORT_WINDOW_DAYS,
} from '@/lib/report/reportConstants';

export type ReportDateRange = {
  fromDateKey: string;
  toDateKey: string;
};

export type ReportDateRangeBounds = {
  minDateKey: string;
  maxDateKey: string;
};

export const REPORT_RANGE_PICKER_STEP = {
  year: 'year',
  month: 'month',
  day: 'day',
} as const;

export type ReportRangePickerStep =
  (typeof REPORT_RANGE_PICKER_STEP)[keyof typeof REPORT_RANGE_PICKER_STEP];

export const countInclusiveDays = (fromKey: string, toKey: string): number => {
  const from = parseDateKey(fromKey).getTime();
  const to = parseDateKey(toKey).getTime();
  const dayMs = 24 * 60 * 60 * 1000;

  return Math.max(1, Math.floor((to - from) / dayMs) + 1);
};

export const buildDateKeysInclusive = (
  fromKey: string,
  toKey: string,
): string[] => {
  if (fromKey > toKey) {
    return [];
  }

  const keys: string[] = [];
  let cursor = fromKey;

  while (cursor <= toKey) {
    keys.push(cursor);
    cursor = addDaysToKey(cursor, 1);
  }

  return keys;
};

export const clampDateKey = (
  dateKey: string,
  bounds: ReportDateRangeBounds,
): string => {
  if (dateKey < bounds.minDateKey) {
    return bounds.minDateKey;
  }

  if (dateKey > bounds.maxDateKey) {
    return bounds.maxDateKey;
  }

  return dateKey;
};

export const clampReportDateRange = (
  range: ReportDateRange,
  bounds: ReportDateRangeBounds,
): ReportDateRange => {
  let fromDateKey = clampDateKey(range.fromDateKey, bounds);
  const toDateKey = clampDateKey(range.toDateKey, bounds);

  if (fromDateKey > toDateKey) {
    fromDateKey = toDateKey;
  }

  return { fromDateKey, toDateKey };
};

export const resolveReportBounds = (
  createdAtIso: string | null | undefined,
): ReportDateRangeBounds => {
  const todayKey = formatDateKey(new Date());
  let minDateKey = todayKey;

  if (createdAtIso) {
    const created = new Date(createdAtIso);

    if (!Number.isNaN(created.getTime())) {
      minDateKey = formatDateKey(created);
    }
  }

  if (minDateKey > todayKey) {
    minDateKey = todayKey;
  }

  return { minDateKey, maxDateKey: todayKey };
};

export const buildDefaultReportRange = (
  bounds: ReportDateRangeBounds,
  windowDays: number,
): ReportDateRange => {
  const endKey = bounds.maxDateKey;
  const preferredFrom = addDaysToKey(endKey, -(Math.max(windowDays, 1) - 1));
  const fromDateKey =
    preferredFrom < bounds.minDateKey ? bounds.minDateKey : preferredFrom;

  return { fromDateKey, toDateKey: endKey };
};

export const defaultWindowDaysForTab = (isDoctor: boolean): number =>
  isDoctor ? DOCTOR_REPORT_WINDOW_DAYS : REPORT_WINDOW_DAYS;

export const formatReportDateKey = (dateKey: string): string => {
  const parts = dateKey.split('-');

  if (parts.length !== 3) {
    return dateKey;
  }

  return `${parts[2]}.${parts[1]}.${parts[0]}`;
};
