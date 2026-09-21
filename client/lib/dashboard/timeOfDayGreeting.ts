export const TIME_OF_DAY = {
  morning: 'morning',
  afternoon: 'afternoon',
  evening: 'evening',
} as const;

export type TimeOfDay = (typeof TIME_OF_DAY)[keyof typeof TIME_OF_DAY];

export const getTimeOfDay = (date = new Date()): TimeOfDay => {
  const hour = date.getHours();

  if (hour < 12) {
    return TIME_OF_DAY.morning;
  }

  if (hour < 18) {
    return TIME_OF_DAY.afternoon;
  }

  return TIME_OF_DAY.evening;
};

export const TIME_OF_DAY_GREETING_KEY: Record<TimeOfDay, string> = {
  [TIME_OF_DAY.morning]: 'dashboard_greeting_morning',
  [TIME_OF_DAY.afternoon]: 'dashboard_greeting_afternoon',
  [TIME_OF_DAY.evening]: 'dashboard_greeting_evening',
};
