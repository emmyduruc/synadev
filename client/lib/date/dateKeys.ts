const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const isDateKey = (value: string): boolean => DATE_KEY_PATTERN.test(value);

export const fromDateKey = (dateKey: string): Date => {
  const [year, month, day] = dateKey.split('-').map(Number);

  return new Date(year, month - 1, day);
};

export const addDaysToKey = (dateKey: string, delta: number): string => {
  const date = fromDateKey(dateKey);
  date.setDate(date.getDate() + delta);

  return toDateKey(date);
};

export const isTodayKey = (dateKey: string): boolean => dateKey === toDateKey(new Date());

export type SelectableDay = {
  dateKey: string;
  date: Date;
  isToday: boolean;
};

/**
 * Builds an ascending list of the most recent `count` days ending today.
 * Used by the daily-log date wheel — future days are intentionally excluded.
 */
export const buildRecentDays = (count: number, referenceDate: Date = new Date()): SelectableDay[] => {
  const todayStart = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );
  const todayKey = toDateKey(todayStart);
  const days: SelectableDay[] = [];

  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const date = new Date(todayStart.getTime() - offset * MILLISECONDS_PER_DAY);
    const dateKey = toDateKey(date);

    days.push({ dateKey, date, isToday: dateKey === todayKey });
  }

  return days;
};
