export const PROFILE_TAB = {
  myProfile: 'my_profile',
  deepening: 'deepening',
  healthRecord: 'health_record',
} as const;

export type ProfileTabId = (typeof PROFILE_TAB)[keyof typeof PROFILE_TAB];

export const PROFILE_COMPLETION_PERCENT = 75;
