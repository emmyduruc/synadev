export const SYMPTOM_CATEGORY = {
  vasomotor: 'vasomotor',
  mood: 'mood',
  sleepEnergy: 'sleep_energy',
  bodyPain: 'body_pain',
  cycle: 'cycle',
  urogenital: 'urogenital',
  digestion: 'digestion',
  skin: 'skin',
} as const;

export type SymptomCategoryId = (typeof SYMPTOM_CATEGORY)[keyof typeof SYMPTOM_CATEGORY];

export type SymptomOption = {
  id: string;
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

/**
 * SYNA symptom taxonomy — tuned for peri/menopause (MRS-II aligned) rather than
 * the fertility-first Flo set. Grouped so logged data can feed the MRS subscales.
 */
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
    ],
  },
  {
    id: SYMPTOM_CATEGORY.mood,
    titleKey: 'symptom_category_mood',
    sectionClassName: 'border-lavender bg-lavender-light',
    wellClassName: 'bg-lavender',
    options: [
      { id: 'calm', emoji: '😌', labelKey: 'symptom_calm' },
      { id: 'irritable', emoji: '😠', labelKey: 'symptom_irritable' },
      { id: 'anxious', emoji: '😰', labelKey: 'symptom_anxious' },
      { id: 'low_mood', emoji: '😔', labelKey: 'symptom_low_mood' },
      { id: 'mood_swings', emoji: '🎭', labelKey: 'symptom_mood_swings' },
      { id: 'brain_fog', emoji: '🌫️', labelKey: 'symptom_brain_fog' },
    ],
  },
  {
    id: SYMPTOM_CATEGORY.sleepEnergy,
    titleKey: 'symptom_category_sleep_energy',
    sectionClassName: 'border-sage-mist bg-sage-mist-light',
    wellClassName: 'bg-sage-mist',
    options: [
      { id: 'insomnia', emoji: '🌙', labelKey: 'symptom_insomnia' },
      { id: 'fatigue', emoji: '🪫', labelKey: 'symptom_fatigue' },
      { id: 'sleepy', emoji: '😴', labelKey: 'symptom_sleepy' },
    ],
  },
  {
    id: SYMPTOM_CATEGORY.bodyPain,
    titleKey: 'symptom_category_body_pain',
    sectionClassName: 'border-dusty-rose bg-dusty-rose-light',
    wellClassName: 'bg-dusty-rose',
    options: [
      { id: 'headache', emoji: '🤕', labelKey: 'symptom_headache' },
      { id: 'joint_muscle_pain', emoji: '🦵', labelKey: 'symptom_joint_muscle_pain' },
      { id: 'backache', emoji: '🩹', labelKey: 'symptom_backache' },
      { id: 'palpitations', emoji: '💓', labelKey: 'symptom_palpitations' },
      { id: 'breast_tenderness', emoji: '🌸', labelKey: 'symptom_breast_tenderness' },
    ],
  },
  {
    id: SYMPTOM_CATEGORY.cycle,
    titleKey: 'symptom_category_cycle',
    sectionClassName: 'border-primary-200 bg-primary-50',
    wellClassName: 'bg-primary-100',
    options: [
      { id: 'flow_light', emoji: '💧', labelKey: 'symptom_flow_light' },
      { id: 'flow_medium', emoji: '🩸', labelKey: 'symptom_flow_medium' },
      { id: 'flow_heavy', emoji: '🌊', labelKey: 'symptom_flow_heavy' },
      { id: 'blood_clots', emoji: '🔴', labelKey: 'symptom_blood_clots' },
      { id: 'spotting', emoji: '🟤', labelKey: 'symptom_spotting' },
      { id: 'cramps', emoji: '⚡', labelKey: 'symptom_cramps' },
    ],
  },
  {
    id: SYMPTOM_CATEGORY.urogenital,
    titleKey: 'symptom_category_urogenital',
    sectionClassName: 'border-secondary-200 bg-secondary-50',
    wellClassName: 'bg-secondary-200',
    options: [
      { id: 'vaginal_dryness', emoji: '🌵', labelKey: 'symptom_vaginal_dryness' },
      { id: 'vaginal_itching', emoji: '🌿', labelKey: 'symptom_vaginal_itching' },
      { id: 'bladder_urgency', emoji: '🚻', labelKey: 'symptom_bladder_urgency' },
      { id: 'low_libido', emoji: '🌙', labelKey: 'symptom_low_libido' },
      { id: 'unusual_discharge', emoji: '💠', labelKey: 'symptom_unusual_discharge' },
    ],
  },
  {
    id: SYMPTOM_CATEGORY.digestion,
    titleKey: 'symptom_category_digestion',
    sectionClassName: 'border-sage-mist bg-sage-mist-light',
    wellClassName: 'bg-sage-mist',
    options: [
      { id: 'nausea', emoji: '🤢', labelKey: 'symptom_nausea' },
      { id: 'bloating', emoji: '🎈', labelKey: 'symptom_bloating' },
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
    ],
  },
];
