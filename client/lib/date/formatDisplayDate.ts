/** Short heading for dashboard surfaces, e.g. "Mon, Jul 13". */
export const formatTodayDisplayDate = (date: Date = new Date()): string =>
  date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
