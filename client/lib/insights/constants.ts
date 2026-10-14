export const INSIGHT_ID = {
  mrs: 'mrs',
  pam: 'pam',
  sleep: 'sleep',
  hrv: 'hrv',
  cycle: 'cycle',
} as const;

export type InsightId = (typeof INSIGHT_ID)[keyof typeof INSIGHT_ID];

export const INSIGHT_ICON_KEY = {
  pattern: 'pattern',
  sleep: 'sleep',
  flame: 'flame',
  flower: 'flower',
  hrv: 'hrv',
  period: 'period',
} as const;

export type InsightIconKey = (typeof INSIGHT_ICON_KEY)[keyof typeof INSIGHT_ICON_KEY];

export const INSIGHT_SURFACE_KEY = {
  mrs: 'mrs',
  pam: 'pam',
  sleep: 'sleep',
  hrv: 'hrv',
  cycle: 'cycle',
} as const;

export type InsightSurfaceKey = (typeof INSIGHT_SURFACE_KEY)[keyof typeof INSIGHT_SURFACE_KEY];

/** Recent window used for sleep / HRV insight averages. */
export const DASHBOARD_INSIGHT_HEALTH_WINDOW_DAYS = 7;
