export const LOADING_VARIANT = {
  cycleCalendar: 'cycle_calendar',
  symptoms: 'symptoms',
  mood: 'mood',
  generic: 'generic',
} as const;

export type LoadingVariant = (typeof LOADING_VARIANT)[keyof typeof LOADING_VARIANT];

export const LOADING_VARIANT_TITLE_KEY: Record<LoadingVariant, string> = {
  [LOADING_VARIANT.cycleCalendar]: 'loading_mascot_cycle_title',
  [LOADING_VARIANT.symptoms]: 'loading_mascot_symptoms_title',
  [LOADING_VARIANT.mood]: 'loading_mascot_mood_title',
  [LOADING_VARIANT.generic]: 'loading_mascot_generic_title',
};

export const LOADING_VARIANT_MESSAGE_KEY: Record<LoadingVariant, string> = {
  [LOADING_VARIANT.cycleCalendar]: 'loading_mascot_cycle_message',
  [LOADING_VARIANT.symptoms]: 'loading_mascot_symptoms_message',
  [LOADING_VARIANT.mood]: 'loading_mascot_mood_message',
  [LOADING_VARIANT.generic]: 'loading_mascot_generic_message',
};

/** Minimum time the mascot stays visible so the moment feels intentional, not flickery. */
export const MASCOT_LOADING_MIN_MS = 500;

/** Fade-in when the overlay appears. */
export const MASCOT_LOADING_ENTER_MS = 200;

/** Fade-out duration when dismissing the overlay. */
export const MASCOT_LOADING_FADE_MS = 360;
