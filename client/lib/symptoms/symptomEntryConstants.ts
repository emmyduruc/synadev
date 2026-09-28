import type { SymptomCategoryId, SymptomId } from '@syna/shared-types';

import { SYMPTOM_CATEGORY } from '@/lib/symptoms/symptomCatalog';

export const SYMPTOM_ENTRY_TAB = {
  symptoms: 'symptoms',
  period: 'period',
  mood: 'mood',
} as const;

export type SymptomEntryTabId = (typeof SYMPTOM_ENTRY_TAB)[keyof typeof SYMPTOM_ENTRY_TAB];

export const SYMPTOM_ENTRY_FILTER = {
  favorites: 'favorites',
  vasomotor: SYMPTOM_CATEGORY.vasomotor,
  sleepEnergy: SYMPTOM_CATEGORY.sleepEnergy,
  mood: SYMPTOM_CATEGORY.mood,
  bodyPain: SYMPTOM_CATEGORY.bodyPain,
  cycle: SYMPTOM_CATEGORY.cycle,
  urogenital: SYMPTOM_CATEGORY.urogenital,
  digestion: SYMPTOM_CATEGORY.digestion,
  skin: SYMPTOM_CATEGORY.skin,
  cognition: SYMPTOM_CATEGORY.cognition,
} as const;

export type SymptomEntryFilterId =
  | typeof SYMPTOM_ENTRY_FILTER.favorites
  | Exclude<SymptomCategoryId, 'miscellaneous'>;

export const SYMPTOM_ENTRY_FILTER_ORDER: readonly SymptomEntryFilterId[] = [
  SYMPTOM_ENTRY_FILTER.favorites,
  SYMPTOM_ENTRY_FILTER.vasomotor,
  SYMPTOM_ENTRY_FILTER.sleepEnergy,
  SYMPTOM_ENTRY_FILTER.mood,
  SYMPTOM_ENTRY_FILTER.bodyPain,
  SYMPTOM_ENTRY_FILTER.cycle,
  SYMPTOM_ENTRY_FILTER.urogenital,
  SYMPTOM_ENTRY_FILTER.digestion,
  SYMPTOM_ENTRY_FILTER.skin,
  SYMPTOM_ENTRY_FILTER.cognition,
];

export const SYMPTOM_ENTRY_FILTER_LABEL_KEY: Record<SymptomEntryFilterId, string> = {
  favorites: 'symptom_entry_filter_favorites',
  vasomotor: 'symptom_entry_filter_heat_sweating',
  sleep_energy: 'symptom_entry_filter_sleep_energy',
  mood: 'symptom_entry_filter_mood_psyche',
  body_pain: 'symptom_category_body_pain',
  cycle: 'symptom_category_cycle',
  urogenital: 'symptom_category_urogenital',
  digestion: 'symptom_category_digestion',
  skin: 'symptom_category_skin',
  cognition: 'symptom_category_cognition',
};

/** Categories offered when creating an own symptom (matches prototype selector). */
export const OWN_SYMPTOM_CATEGORY_ORDER = [
  SYMPTOM_CATEGORY.vasomotor,
  SYMPTOM_CATEGORY.sleepEnergy,
  SYMPTOM_CATEGORY.mood,
  SYMPTOM_CATEGORY.bodyPain,
  SYMPTOM_CATEGORY.cycle,
  SYMPTOM_CATEGORY.urogenital,
  SYMPTOM_CATEGORY.cognition,
  SYMPTOM_CATEGORY.skin,
  SYMPTOM_CATEGORY.miscellaneous,
] as const;

export const OWN_SYMPTOM_CATEGORY_LABEL_KEY: Record<
  (typeof OWN_SYMPTOM_CATEGORY_ORDER)[number],
  string
> = {
  vasomotor: 'symptom_entry_filter_heat_sweating',
  sleep_energy: 'symptom_entry_filter_sleep_energy',
  mood: 'symptom_own_category_mood_psyche',
  body_pain: 'symptom_own_category_body_pain',
  cycle: 'symptom_own_category_cycle_bleeding',
  urogenital: 'symptom_category_urogenital',
  cognition: 'symptom_category_cognition',
  skin: 'symptom_own_category_skin_hair',
  miscellaneous: 'symptom_category_miscellaneous',
};

/** Fixed persistent-complaint presets shown as chips. */
export const PERSISTENT_COMPLAINT_PRESET_IDS = [
  'joint_stiffness',
  'dryness',
  'low_libido',
  'skin_and_hair',
  'forgetfulness',
  'digestive_patterns',
] as const;

export const PERSISTENT_COMPLAINT_CHIP_LABEL_KEY: Record<
  (typeof PERSISTENT_COMPLAINT_PRESET_IDS)[number],
  string
> = {
  joint_stiffness: 'symptom_persistent_chip_joint_stiffness',
  dryness: 'symptom_persistent_chip_dryness',
  low_libido: 'symptom_persistent_chip_libido',
  skin_and_hair: 'symptom_persistent_chip_skin_hair',
  forgetfulness: 'symptom_persistent_chip_forgetfulness',
  digestive_patterns: 'symptom_persistent_chip_digestive',
};

export const SYMPTOM_ENTRY_DATE_STRIP_DAYS = 14;

export const DEFAULT_SYMPTOM_INTENSITY = 2;

export const SYMPTOM_INTENSITY_LABEL_KEYS = [
  'symptom_intensity_none',
  'symptom_intensity_mild',
  'symptom_intensity_moderate',
  'symptom_intensity_strong',
  'symptom_intensity_very_strong',
] as const;

export const OFTEN_WITH_YOU_LIMIT = 6;
export const OFTEN_WITH_YOU_MIN_DAYS = 2;
export const PERSISTENT_COMPLAINT_MIN_DAYS = 5;

/** Default "often with you" suggestions when history is thin (matches entry UI mock). */
export const DEFAULT_OFTEN_WITH_YOU_IDS: readonly SymptomId[] = [
  'nocturia',
  'fatigue',
  'breast_tenderness',
  'mood_swings',
  'hot_flashes',
];
