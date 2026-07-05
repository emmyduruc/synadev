export const PROFILE_TAB = {
  myProfile: 'my_profile',
  deepening: 'deepening',
  healthRecord: 'health_record',
} as const;

export type ProfileTabId = (typeof PROFILE_TAB)[keyof typeof PROFILE_TAB];

export const PROFILE_COMPLETION_PERCENT = 75;

export const PROFILE_MISSING_FIELD = {
  bodyMetrics: 'body_metrics',
  origin: 'origin',
  smokingStatus: 'smoking_status',
  socialConnection: 'social_connection',
} as const;

export type ProfileMissingFieldId =
  (typeof PROFILE_MISSING_FIELD)[keyof typeof PROFILE_MISSING_FIELD];

export const PROFILE_MISSING_FIELDS: readonly ProfileMissingFieldId[] = [
  PROFILE_MISSING_FIELD.bodyMetrics,
  PROFILE_MISSING_FIELD.origin,
  PROFILE_MISSING_FIELD.smokingStatus,
  PROFILE_MISSING_FIELD.socialConnection,
];

export const STATIC_PROFILE = {
  name: 'Enrico',
  ageYears: 48,
  origin: null as string | null,
};
