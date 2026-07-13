export const CALENDAR_VIEW = {
  month: 'month',
  year: 'year',
} as const;

export type CalendarView = (typeof CALENDAR_VIEW)[keyof typeof CALENDAR_VIEW];

export type CalendarWeekDay = {
  date: Date;
  dayKey: string;
  isToday: boolean;
};

export type CalendarMonthDay = {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
};

export type CalendarMonth = {
  monthIndex: number;
  year: number;
  labelKey: string;
  weeks: CalendarMonthDay[][];
};

const DAY_MS = 86_400_000;

const isSameDay = (left: Date, right: Date): boolean =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const getMondayBasedWeekStart = (date: Date): Date => {
  const normalized = startOfDay(date);
  const dayIndex = (normalized.getDay() + 6) % 7;
  normalized.setDate(normalized.getDate() - dayIndex);
  return normalized;
};

export const getCurrentWeekDays = (referenceDate = new Date()): CalendarWeekDay[] => {
  const weekStart = getMondayBasedWeekStart(referenceDate);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);

    return {
      date,
      dayKey: date.toISOString(),
      isToday: isSameDay(date, referenceDate),
    };
  });
};

export const buildMonthGrid = (year: number, monthIndex: number, today = new Date()): CalendarMonthDay[][] => {
  const firstOfMonth = new Date(year, monthIndex, 1);
  const gridStart = getMondayBasedWeekStart(firstOfMonth);
  const weeks: CalendarMonthDay[][] = [];

  for (let weekIndex = 0; weekIndex < 6; weekIndex += 1) {
    const week: CalendarMonthDay[] = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const date = new Date(gridStart.getTime() + (weekIndex * 7 + dayIndex) * DAY_MS);

      week.push({
        date,
        dayNumber: date.getDate(),
        isCurrentMonth: date.getMonth() === monthIndex,
        isToday: isSameDay(date, today),
      });
    }

    weeks.push(week);
  }

  return weeks;
};

export const buildYearMonths = (year: number, today = new Date()): CalendarMonth[] =>
  Array.from({ length: 12 }, (_, monthIndex) => ({
    monthIndex,
    year,
    labelKey: `calendar_month_${monthIndex + 1}`,
    weeks: buildMonthGrid(year, monthIndex, today),
  }));

export const WEEKDAY_LABEL_KEYS = [
  'calendar_weekday_mon',
  'calendar_weekday_tue',
  'calendar_weekday_wed',
  'calendar_weekday_thu',
  'calendar_weekday_fri',
  'calendar_weekday_sat',
  'calendar_weekday_sun',
] as const;

export const CALENDAR_WEEKDAY_HEADER_KEYS = [
  'calendar_weekday_short_mon',
  'calendar_weekday_short_tue',
  'calendar_weekday_short_wed',
  'calendar_weekday_short_thu',
  'calendar_weekday_short_fri',
  'calendar_weekday_short_sat',
  'calendar_weekday_short_sun',
] as const;
