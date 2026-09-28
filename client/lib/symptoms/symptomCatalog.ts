import type { SymptomCategoryId, SymptomId } from '@syna/shared-types';

export const SYMPTOM_CATEGORY = {
  vasomotor: 'vasomotor',
  mood: 'mood',
  sleepEnergy: 'sleep_energy',
  bodyPain: 'body_pain',
  cycle: 'cycle',
  urogenital: 'urogenital',
  digestion: 'digestion',
  skin: 'skin',
  cognition: 'cognition',
  miscellaneous: 'miscellaneous',
} as const satisfies Record<string, SymptomCategoryId>;

export type { SymptomCategoryId };

export type SymptomOption = {
  id: SymptomId;
  emoji: string;
  labelKey: string;
};

export type SymptomCategory = {
  id: SymptomCategoryId;
  titleKey: string;
  /** Tinted, bordered card wrapping the whole category section */
  sectionClassName: string;
  /** Emoji well tint for chips inside the category */
  wellClassName: string;
  options: SymptomOption[];
};

export const SYMPTOM_CATEGORIES: readonly SymptomCategory[] = [
  {
    id: SYMPTOM_CATEGORY.vasomotor,
    titleKey: 'symptom_category_vasomotor',
    sectionClassName: 'border-apricot bg-apricot-light',
    wellClassName: 'bg-apricot',
    options: [
      { id: 'hot_flashes', emoji: '🔥', labelKey: 'symptom_hot_flashes' },
      { id: 'night_sweats', emoji: '💦', labelKey: 'symptom_night_sweats' },
      { id: 'sweating', emoji: '🥵', labelKey: 'symptom_sweating' },
      { id: 'chills', emoji: '❄️', labelKey: 'symptom_chills' },
    ],
  },
  {
    id: SYMPTOM_CATEGORY.mood,
    titleKey: 'symptom_category_mood',
    sectionClassName: 'border-lavender bg-lavender-light',
    wellClassName: 'bg-lavender',
    options: [
      { id: 'irritable', emoji: '✨', labelKey: 'symptom_irritable' },
      { id: 'anxious', emoji: '🌊', labelKey: 'symptom_anxious' },
      { id: 'low_mood', emoji: '☁️', labelKey: 'symptom_low_mood' },
      { id: 'mood_swings', emoji: '🎭', labelKey: 'symptom_mood_swings' },
      { id: 'inner_restlessness', emoji: '🌀', labelKey: 'symptom_inner_restlessness' },
    ],
  },
  {
    id: SYMPTOM_CATEGORY.sleepEnergy,
    titleKey: 'symptom_category_sleep_energy',
    sectionClassName: 'border-sage-mist bg-sage-mist-light',
    wellClassName: 'bg-sage-mist',
    options: [
      { id: 'insomnia', emoji: '🌙', labelKey: 'symptom_insomnia' },
      { id: 'sleep_maintenance', emoji: '🌙', labelKey: 'symptom_sleep_maintenance' },
      { id: 'fatigue', emoji: '🪫', labelKey: 'symptom_fatigue' },
      { id: 'nocturia', emoji: '💧', labelKey: 'symptom_nocturia' },
    ],
  },
  {
    id: SYMPTOM_CATEGORY.bodyPain,
    titleKey: 'symptom_category_body_pain',
    sectionClassName: 'border-dusty-rose bg-dusty-rose-light',
    wellClassName: 'bg-dusty-rose',
    options: [
      { id: 'joint_muscle_pain', emoji: '🦵', labelKey: 'symptom_joint_muscle_pain' },
      { id: 'joint_stiffness', emoji: '🦴', labelKey: 'symptom_joint_stiffness' },
      { id: 'muscle_pain', emoji: '💪', labelKey: 'symptom_muscle_pain' },
      { id: 'headache', emoji: '🤕', labelKey: 'symptom_headache' },
      { id: 'palpitations', emoji: '💓', labelKey: 'symptom_palpitations' },
      { id: 'breast_tenderness', emoji: '🌸', labelKey: 'symptom_breast_tenderness' },
      { id: 'dizziness', emoji: '😵', labelKey: 'symptom_dizziness' },
      { id: 'tingling', emoji: '✨', labelKey: 'symptom_tingling' },
      { id: 'bloating', emoji: '🎈', labelKey: 'symptom_bloating' },
      { id: 'digestive_patterns', emoji: '🌀', labelKey: 'symptom_digestive_patterns' },
    ],
  },
  {
    id: SYMPTOM_CATEGORY.cycle,
    titleKey: 'symptom_category_cycle',
    sectionClassName: 'border-primary-200 bg-primary-50',
    wellClassName: 'bg-primary-100',
    options: [
      { id: 'bleeding', emoji: '💧', labelKey: 'symptom_bleeding' },
      { id: 'spotting', emoji: '💧', labelKey: 'symptom_spotting' },
      { id: 'cramps', emoji: '⚡', labelKey: 'symptom_cramps' },
    ],
  },
  {
    id: SYMPTOM_CATEGORY.urogenital,
    titleKey: 'symptom_category_urogenital',
    sectionClassName: 'border-secondary-200 bg-secondary-50',
    wellClassName: 'bg-secondary-200',
    options: [
      { id: 'dryness', emoji: '✨', labelKey: 'symptom_dryness' },
      { id: 'low_libido', emoji: '❤️', labelKey: 'symptom_low_libido' },
      { id: 'bladder_urgency', emoji: '💧', labelKey: 'symptom_bladder_urgency' },
      { id: 'pain_on_urination', emoji: '💧', labelKey: 'symptom_pain_on_urination' },
    ],
  },
  {
    id: SYMPTOM_CATEGORY.digestion,
    titleKey: 'symptom_category_digestion',
    sectionClassName: 'border-sage-mist bg-sage-mist-light',
    wellClassName: 'bg-sage-mist',
    options: [
      { id: 'nausea', emoji: '🤢', labelKey: 'symptom_nausea' },
      { id: 'constipation', emoji: '🚽', labelKey: 'symptom_constipation' },
      { id: 'diarrhea', emoji: '💩', labelKey: 'symptom_diarrhea' },
      { id: 'cravings', emoji: '🍫', labelKey: 'symptom_cravings' },
    ],
  },
  {
    id: SYMPTOM_CATEGORY.skin,
    titleKey: 'symptom_category_skin',
    sectionClassName: 'border-apricot bg-apricot-light',
    wellClassName: 'bg-apricot',
    options: [
      { id: 'acne', emoji: '🪞', labelKey: 'symptom_acne' },
      { id: 'dry_skin', emoji: '🏜️', labelKey: 'symptom_dry_skin' },
      { id: 'itchy_skin', emoji: '🪶', labelKey: 'symptom_itchy_skin' },
      { id: 'skin_and_hair', emoji: '💇', labelKey: 'symptom_skin_and_hair' },
    ],
  },
  {
    id: SYMPTOM_CATEGORY.cognition,
    titleKey: 'symptom_category_cognition',
    sectionClassName: 'border-lavender bg-lavender-light',
    wellClassName: 'bg-lavender',
    options: [
      { id: 'forgetfulness', emoji: '🧠', labelKey: 'symptom_forgetfulness' },
      { id: 'brain_fog', emoji: '🌫️', labelKey: 'symptom_brain_fog' },
    ],
  },
  {
    id: SYMPTOM_CATEGORY.miscellaneous,
    titleKey: 'symptom_category_miscellaneous',
    sectionClassName: 'border-border bg-muted/40',
    wellClassName: 'bg-muted',
    options: [],
  },
];
