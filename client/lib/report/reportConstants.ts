export const REPORT_TAB = {
  forYou: 'for_you',
  forDoctor: 'for_doctor',
} as const;

export type ReportTabId = (typeof REPORT_TAB)[keyof typeof REPORT_TAB];

export const REPORT_WINDOW_DAYS = 18;
export const DOCTOR_REPORT_WINDOW_DAYS = 28;
export const REPORT_MIN_TRACKED_DAYS = 7;

export const HEAT_SYMPTOM_IDS = ['hot_flashes', 'night_sweats', 'sweating'] as const;
