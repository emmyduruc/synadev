export const INSIGHT_ID = {
  mrs: 'mrs',
  sleep: 'sleep',
  heat: 'heat',
} as const;

export type InsightId = (typeof INSIGHT_ID)[keyof typeof INSIGHT_ID];

export const INSIGHT_ICON_KEY = {
  pattern: 'pattern',
  sleep: 'sleep',
  flame: 'flame',
  flower: 'flower',
} as const;

export type InsightIconKey = (typeof INSIGHT_ICON_KEY)[keyof typeof INSIGHT_ICON_KEY];

export const INSIGHT_SURFACE_KEY = {
  mrs: 'mrs',
  sleep: 'sleep',
  heat: 'heat',
} as const;

export type InsightSurfaceKey = (typeof INSIGHT_SURFACE_KEY)[keyof typeof INSIGHT_SURFACE_KEY];

export const INSIGHT_STORY_MAX_SLIDES = 3;
