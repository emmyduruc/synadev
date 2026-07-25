export const CALENDAR_MODE = {
  browse: 'browse',
  editPeriod: 'edit_period',
} as const;

export type CalendarMode = (typeof CALENDAR_MODE)[keyof typeof CALENDAR_MODE];
