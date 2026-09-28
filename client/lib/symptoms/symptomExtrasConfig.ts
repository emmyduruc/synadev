import type { SymptomId } from '@syna/shared-types';

export type SymptomExtraOption = {
  value: string;
  labelKey: string;
};

export type SymptomExtraQuestion = {
  key: string;
  labelKey: string;
  options: readonly SymptomExtraOption[];
  /** `grid` lays options in pairs (2+1 for three options). Default is a single row. */
  layout?: 'row' | 'grid';
};

const YES_NO_OPTIONS: readonly SymptomExtraOption[] = [
  { value: 'yes', labelKey: 'symptom_extra_yes' },
  { value: 'no', labelKey: 'symptom_extra_no' },
];

const DIGESTION_EXTRAS: readonly SymptomExtraQuestion[] = [
  {
    key: 'digestion_pattern',
    labelKey: 'symptom_extra_digestion_how_was',
    layout: 'grid',
    options: [
      { value: 'normal', labelKey: 'symptom_extra_digestion_normal' },
      { value: 'alternating', labelKey: 'symptom_extra_digestion_alternating' },
      { value: 'persistent_constipation', labelKey: 'symptom_extra_digestion_constipation' },
      { value: 'persistent_diarrhea', labelKey: 'symptom_extra_digestion_diarrhea' },
    ],
  },
  {
    key: 'noticed',
    labelKey: 'symptom_extra_digestion_noticed',
    layout: 'grid',
    options: [
      { value: 'blood_in_stool', labelKey: 'symptom_extra_digestion_blood_in_stool' },
      { value: 'weight_loss', labelKey: 'symptom_extra_digestion_weight_loss' },
      { value: 'fever', labelKey: 'symptom_extra_digestion_fever' },
      { value: 'none', labelKey: 'symptom_extra_accompany_none' },
    ],
  },
];

export const SYMPTOM_EXTRAS_CONFIG: Partial<Record<SymptomId, readonly SymptomExtraQuestion[]>> = {
  nocturia: [
    {
      key: 'night_frequency',
      labelKey: 'symptom_extra_nocturia_night_frequency',
      layout: 'grid',
      options: [
        { value: '0', labelKey: 'symptom_extra_freq_0' },
        { value: '1', labelKey: 'symptom_extra_freq_1' },
        { value: '2_3', labelKey: 'symptom_extra_freq_2_3' },
        { value: '4_plus', labelKey: 'symptom_extra_freq_4_plus' },
      ],
    },
    {
      key: 'hard_to_sleep_again',
      labelKey: 'symptom_extra_nocturia_hard_to_sleep',
      options: YES_NO_OPTIONS,
    },
  ],
  fatigue: [
    {
      key: 'when_strongest',
      labelKey: 'symptom_extra_fatigue_when_strongest',
      layout: 'grid',
      options: [
        { value: 'all_day', labelKey: 'symptom_extra_time_all_day' },
        { value: 'morning', labelKey: 'symptom_extra_time_mostly_morning' },
        { value: 'afternoon', labelKey: 'symptom_extra_time_mostly_afternoon' },
      ],
    },
    {
      key: 'restricted',
      labelKey: 'symptom_extra_fatigue_restricted',
      options: YES_NO_OPTIONS,
    },
  ],
  insomnia: [
    {
      key: 'kept_awake_by',
      labelKey: 'symptom_extra_insomnia_kept_awake',
      layout: 'grid',
      options: [
        { value: 'inner_restlessness', labelKey: 'symptom_extra_kept_awake_restlessness' },
        { value: 'racing_thoughts', labelKey: 'symptom_extra_kept_awake_racing_thoughts' },
        { value: 'worries_stress', labelKey: 'symptom_extra_kept_awake_worries' },
        { value: 'physical_complaints', labelKey: 'symptom_extra_kept_awake_physical' },
      ],
    },
    {
      key: 'since_when',
      labelKey: 'symptom_extra_insomnia_since_when',
      options: [
        { value: 'under_3_months', labelKey: 'symptom_extra_since_under_3_months' },
        { value: '3_months_or_longer', labelKey: 'symptom_extra_since_3_months_or_longer' },
      ],
    },
    {
      key: 'daytime_effect',
      labelKey: 'symptom_extra_insomnia_daytime_effect',
      layout: 'grid',
      options: [
        { value: 'daytime_fatigue', labelKey: 'symptom_extra_day_effect_fatigue' },
        { value: 'concentration', labelKey: 'symptom_extra_day_effect_concentration' },
        { value: 'irritability', labelKey: 'symptom_extra_day_effect_irritability' },
        { value: 'none', labelKey: 'symptom_extra_accompany_none' },
      ],
    },
  ],
  sleep_maintenance: [
    {
      key: 'wake_reason',
      labelKey: 'symptom_extra_sleep_maintenance_wake_reason',
      layout: 'grid',
      options: [
        { value: 'bladder_urgency', labelKey: 'symptom_extra_wake_bladder' },
        { value: 'heat_sweat', labelKey: 'symptom_extra_wake_heat_sweat' },
        { value: 'pain_restlessness', labelKey: 'symptom_extra_wake_pain' },
        { value: 'unknown', labelKey: 'symptom_extra_wake_unknown' },
      ],
    },
    {
      key: 'night_frequency',
      labelKey: 'symptom_extra_sleep_maintenance_night_frequency',
      layout: 'grid',
      options: [
        { value: '0', labelKey: 'symptom_extra_freq_0' },
        { value: '1_2', labelKey: 'symptom_extra_freq_1_2' },
        { value: '3_4', labelKey: 'symptom_extra_freq_3_4' },
        { value: '5_plus', labelKey: 'symptom_extra_freq_5_plus' },
      ],
    },
    {
      key: 'early_awakening',
      labelKey: 'symptom_extra_sleep_maintenance_early_awakening',
      options: YES_NO_OPTIONS,
    },
    {
      key: 'times_awoken',
      labelKey: 'symptom_extra_sleep_maintenance_times_awoken',
      layout: 'grid',
      options: [
        { value: 'none', labelKey: 'symptom_extra_awoken_none' },
        { value: '1', labelKey: 'symptom_extra_awoken_1' },
        { value: '2', labelKey: 'symptom_extra_awoken_2' },
        { value: '3_plus', labelKey: 'symptom_extra_awoken_3_plus' },
      ],
    },
  ],
  breast_tenderness: [
    {
      key: 'cycle_related',
      labelKey: 'symptom_extra_breast_cycle_related',
      options: YES_NO_OPTIONS,
    },
    {
      key: 'lump',
      labelKey: 'symptom_extra_breast_lump',
      options: YES_NO_OPTIONS,
    },
  ],
  mood_swings: [
    {
      key: 'day_frequency',
      labelKey: 'symptom_extra_mood_day_frequency',
      layout: 'grid',
      options: [
        { value: '0', labelKey: 'symptom_extra_freq_0' },
        { value: '1_3', labelKey: 'symptom_extra_freq_1_3' },
        { value: '4_7', labelKey: 'symptom_extra_freq_4_7' },
        { value: '8_plus', labelKey: 'symptom_extra_freq_8_plus' },
      ],
    },
    {
      key: 'clear_triggers',
      labelKey: 'symptom_extra_mood_clear_triggers',
      options: YES_NO_OPTIONS,
    },
  ],
  irritable: [
    {
      key: 'course',
      labelKey: 'symptom_extra_irritable_course',
      options: [
        { value: 'short_waves', labelKey: 'symptom_extra_irritable_short_waves' },
        { value: 'persistent', labelKey: 'symptom_extra_irritable_persistent' },
      ],
    },
    {
      key: 'strained_relationships',
      labelKey: 'symptom_extra_irritable_strained_relationships',
      options: YES_NO_OPTIONS,
    },
  ],
  anxious: [
    {
      key: 'how_shown',
      labelKey: 'symptom_extra_anxious_how_shown',
      layout: 'grid',
      options: [
        { value: 'free_floating', labelKey: 'symptom_extra_anxious_free_floating' },
        { value: 'panic_attacks', labelKey: 'symptom_extra_anxious_panic_attacks' },
        { value: 'strong_worries', labelKey: 'symptom_extra_anxious_strong_worries' },
        { value: 'physical_symptoms', labelKey: 'symptom_extra_anxious_physical' },
      ],
    },
    {
      key: 'avoided_something',
      labelKey: 'symptom_extra_anxious_avoided',
      options: YES_NO_OPTIONS,
    },
  ],
  low_mood: [
    {
      key: 'what_noticeable',
      labelKey: 'symptom_extra_low_mood_noticeable',
      layout: 'grid',
      options: [
        { value: 'little_joy', labelKey: 'symptom_extra_low_mood_little_joy' },
        { value: 'loss_of_interest', labelKey: 'symptom_extra_low_mood_loss_of_interest' },
        { value: 'negative_thoughts', labelKey: 'symptom_extra_low_mood_negative_thoughts' },
      ],
    },
    {
      key: 'social_withdrawal',
      labelKey: 'symptom_extra_low_mood_social_withdrawal',
      options: YES_NO_OPTIONS,
    },
  ],
  inner_restlessness: [
    {
      key: 'how_felt',
      labelKey: 'symptom_extra_inner_restlessness_how_felt',
      layout: 'grid',
      options: [
        { value: 'physically_driven', labelKey: 'symptom_extra_inner_restlessness_driven' },
        { value: 'racing_thoughts', labelKey: 'symptom_extra_inner_restlessness_racing' },
        { value: 'tension_no_cause', labelKey: 'symptom_extra_inner_restlessness_tension' },
      ],
    },
  ],
  hot_flashes: [
    {
      key: 'day_frequency',
      labelKey: 'symptom_extra_hot_flashes_day_frequency',
      options: [
        { value: '0', labelKey: 'symptom_extra_freq_0' },
        { value: '1_3', labelKey: 'symptom_extra_freq_1_3' },
        { value: '4_7', labelKey: 'symptom_extra_freq_4_7' },
        { value: '8_plus', labelKey: 'symptom_extra_freq_8_plus' },
      ],
    },
    {
      key: 'duration',
      labelKey: 'symptom_extra_hot_flashes_duration',
      options: [
        { value: 'under_1_min', labelKey: 'symptom_extra_duration_under_1' },
        { value: '1_to_5_min', labelKey: 'symptom_extra_duration_1_to_5' },
        { value: 'over_5_min', labelKey: 'symptom_extra_duration_over_5' },
      ],
    },
    {
      key: 'woke_night',
      labelKey: 'symptom_extra_hot_flashes_woke_night',
      options: YES_NO_OPTIONS,
    },
    {
      key: 'accompanying',
      labelKey: 'symptom_extra_hot_flashes_accompanying',
      options: [
        { value: 'palpitations', labelKey: 'symptom_extra_accompany_palpitations' },
        { value: 'anxiety', labelKey: 'symptom_extra_accompany_anxiety' },
        { value: 'chills', labelKey: 'symptom_extra_accompany_chills' },
        { value: 'none', labelKey: 'symptom_extra_accompany_none' },
      ],
    },
  ],
  night_sweats: [
    {
      key: 'changed_clothes_bedding',
      labelKey: 'symptom_extra_night_sweats_changed_clothes',
      options: YES_NO_OPTIONS,
    },
    {
      key: 'woke_from_it',
      labelKey: 'symptom_extra_night_sweats_woke_from_it',
      options: YES_NO_OPTIONS,
    },
  ],
  chills: [
    {
      key: 'with_hot_flashes',
      labelKey: 'symptom_extra_chills_with_hot_flashes',
      options: YES_NO_OPTIONS,
    },
    {
      key: 'fever_or_infection',
      labelKey: 'symptom_extra_chills_fever_or_infection',
      options: YES_NO_OPTIONS,
    },
  ],
  joint_muscle_pain: [
    {
      key: 'which_joints',
      labelKey: 'symptom_extra_joint_pain_which_joints',
      layout: 'grid',
      options: [
        { value: 'hands_fingers', labelKey: 'symptom_extra_joint_hands_fingers' },
        { value: 'knee_hip', labelKey: 'symptom_extra_joint_knee_hip' },
        { value: 'spine', labelKey: 'symptom_extra_joint_spine' },
        { value: 'several', labelKey: 'symptom_extra_joint_several' },
      ],
    },
    {
      key: 'morning_stiffness_30_plus',
      labelKey: 'symptom_extra_joint_pain_morning_stiffness',
      options: YES_NO_OPTIONS,
    },
    {
      key: 'swelling_or_redness',
      labelKey: 'symptom_extra_joint_pain_swelling_redness',
      options: YES_NO_OPTIONS,
    },
  ],
  joint_stiffness: [
    {
      key: 'morning_duration',
      labelKey: 'symptom_extra_joint_stiffness_morning_duration',
      layout: 'grid',
      options: [
        { value: 'under_30_min', labelKey: 'symptom_extra_duration_under_30_min' },
        { value: '30_min_or_longer', labelKey: 'symptom_extra_duration_30_min_or_longer' },
        { value: 'whole_day', labelKey: 'symptom_extra_duration_whole_day' },
      ],
    },
  ],
  muscle_pain: [
    {
      key: 'where',
      labelKey: 'symptom_extra_muscle_pain_where',
      layout: 'grid',
      options: [
        { value: 'local', labelKey: 'symptom_extra_muscle_local' },
        { value: 'several_regions', labelKey: 'symptom_extra_muscle_several_regions' },
        { value: 'whole_body', labelKey: 'symptom_extra_muscle_whole_body' },
      ],
    },
    {
      key: 'worse_with_movement',
      labelKey: 'symptom_extra_muscle_pain_worse_movement',
      options: YES_NO_OPTIONS,
    },
  ],
  headache: [
    {
      key: 'pain_character',
      labelKey: 'symptom_extra_headache_pain_character',
      layout: 'grid',
      options: [
        { value: 'one_sided_pulsating', labelKey: 'symptom_extra_headache_one_sided_pulsating' },
        { value: 'both_sides_dull', labelKey: 'symptom_extra_headache_both_sides_dull' },
        { value: 'new_different', labelKey: 'symptom_extra_headache_new_different' },
      ],
    },
    {
      key: 'accompanying',
      labelKey: 'symptom_extra_headache_accompanying',
      layout: 'grid',
      options: [
        { value: 'nausea', labelKey: 'symptom_extra_headache_nausea' },
        { value: 'light_sensitivity', labelKey: 'symptom_extra_headache_light_sensitivity' },
        { value: 'noise_sensitivity', labelKey: 'symptom_extra_headache_noise_sensitivity' },
      ],
    },
  ],
  palpitations: [
    {
      key: 'at_rest',
      labelKey: 'symptom_extra_palpitations_at_rest',
      options: YES_NO_OPTIONS,
    },
    {
      key: 'accompanying',
      labelKey: 'symptom_extra_palpitations_accompanying',
      layout: 'grid',
      options: [
        { value: 'chest_pain', labelKey: 'symptom_extra_palpitations_chest_pain' },
        { value: 'shortness_of_breath', labelKey: 'symptom_extra_palpitations_shortness_breath' },
        { value: 'fainting_feeling', labelKey: 'symptom_extra_palpitations_fainting_feeling' },
        { value: 'none', labelKey: 'symptom_extra_accompany_none' },
      ],
    },
    {
      key: 'with_heat_or_anxiety',
      labelKey: 'symptom_extra_palpitations_with_heat_anxiety',
      options: YES_NO_OPTIONS,
    },
  ],
  dizziness: [
    {
      key: 'character',
      labelKey: 'symptom_extra_dizziness_character',
      layout: 'grid',
      options: [
        { value: 'spinning', labelKey: 'symptom_extra_dizziness_spinning' },
        { value: 'swaying', labelKey: 'symptom_extra_dizziness_swaying' },
        { value: 'lightheaded', labelKey: 'symptom_extra_dizziness_lightheaded' },
      ],
    },
    {
      key: 'when_occurred',
      labelKey: 'symptom_extra_dizziness_when_occurred',
      layout: 'grid',
      options: [
        { value: 'position_change', labelKey: 'symptom_extra_dizziness_position_change' },
        { value: 'stress', labelKey: 'symptom_extra_trigger_stress' },
        { value: 'exertion', labelKey: 'symptom_extra_dizziness_exertion' },
        { value: 'none', labelKey: 'symptom_extra_accompany_none' },
      ],
    },
  ],
  tingling: [
    {
      key: 'where',
      labelKey: 'symptom_extra_tingling_where',
      layout: 'grid',
      options: [
        { value: 'hands', labelKey: 'symptom_extra_tingling_hands' },
        { value: 'feet', labelKey: 'symptom_extra_tingling_feet' },
        { value: 'one_sided', labelKey: 'symptom_extra_tingling_one_sided' },
        { value: 'both_sides', labelKey: 'symptom_extra_tingling_both_sides' },
      ],
    },
    {
      key: 'duration',
      labelKey: 'symptom_extra_tingling_duration',
      options: [
        { value: 'short_episodes', labelKey: 'symptom_extra_tingling_short_episodes' },
        { value: 'persistent', labelKey: 'symptom_extra_tingling_persistent' },
      ],
    },
  ],
  bloating: DIGESTION_EXTRAS,
  digestive_patterns: DIGESTION_EXTRAS,
  bleeding: [
    {
      key: 'days_so_far',
      labelKey: 'symptom_extra_bleeding_days_so_far',
      layout: 'grid',
      options: [
        { value: '1', labelKey: 'symptom_extra_bleeding_days_1' },
        { value: '2', labelKey: 'symptom_extra_bleeding_days_2' },
        { value: '3', labelKey: 'symptom_extra_bleeding_days_3' },
        { value: '4', labelKey: 'symptom_extra_bleeding_days_4' },
        { value: '5', labelKey: 'symptom_extra_bleeding_days_5' },
        { value: '6', labelKey: 'symptom_extra_bleeding_days_6' },
        { value: '7', labelKey: 'symptom_extra_bleeding_days_7' },
        { value: '8_plus', labelKey: 'symptom_extra_bleeding_days_8_plus' },
      ],
    },
    {
      key: 'flow_strength',
      labelKey: 'symptom_extra_bleeding_how_strong',
      layout: 'grid',
      options: [
        { value: 'light', labelKey: 'symptom_extra_bleeding_strength_light' },
        { value: 'normal', labelKey: 'symptom_extra_bleeding_strength_normal' },
        { value: 'heavy', labelKey: 'symptom_extra_bleeding_strength_heavy' },
      ],
    },
  ],
  spotting: [
    {
      key: 'when_occurred',
      labelKey: 'symptom_extra_spotting_when_occurred',
      layout: 'grid',
      options: [
        { value: 'cycle_independent', labelKey: 'symptom_extra_spotting_cycle_independent' },
        { value: 'after_intercourse', labelKey: 'symptom_extra_spotting_after_intercourse' },
        { value: 'on_hormone_therapy', labelKey: 'symptom_extra_spotting_hormone_therapy' },
      ],
    },
  ],
  cramps: [
    {
      key: 'when_in_cycle',
      labelKey: 'symptom_extra_cramps_when_in_cycle',
      layout: 'grid',
      options: [
        { value: 'start_only', labelKey: 'symptom_extra_cramps_start_only' },
        { value: 'whole_cycle', labelKey: 'symptom_extra_cramps_whole_cycle' },
        { value: 'cycle_independent', labelKey: 'symptom_extra_cramps_cycle_independent' },
      ],
    },
  ],
  dryness: [
    {
      key: 'when_noticeable',
      labelKey: 'symptom_extra_dryness_when_noticeable',
      layout: 'grid',
      options: [
        { value: 'only_during_sex', labelKey: 'symptom_extra_dryness_only_during_sex' },
        { value: 'also_daily_life', labelKey: 'symptom_extra_dryness_also_daily_life' },
        { value: 'both', labelKey: 'symptom_extra_dryness_both' },
      ],
    },
    {
      key: 'accompanying',
      labelKey: 'symptom_extra_dryness_accompanying',
      layout: 'grid',
      options: [
        { value: 'burning', labelKey: 'symptom_extra_dryness_burning' },
        { value: 'itching', labelKey: 'symptom_extra_dryness_itching' },
        { value: 'pain_during_sex', labelKey: 'symptom_extra_dryness_pain_during_sex' },
        { value: 'none', labelKey: 'symptom_extra_accompany_none' },
      ],
    },
  ],
  low_libido: [
    {
      key: 'what_changed',
      labelKey: 'symptom_extra_libido_what_changed',
      layout: 'grid',
      options: [
        { value: 'less_desire', labelKey: 'symptom_extra_libido_less_desire' },
        { value: 'low_energy', labelKey: 'symptom_extra_libido_low_energy' },
        { value: 'avoidance_pain', labelKey: 'symptom_extra_libido_avoidance_pain' },
      ],
    },
  ],
  bladder_urgency: [
    {
      key: 'urgency_character',
      labelKey: 'symptom_extra_urgency_character',
      layout: 'grid',
      options: [
        { value: 'sudden', labelKey: 'symptom_extra_urgency_sudden' },
        { value: 'frequent_small', labelKey: 'symptom_extra_urgency_frequent_small' },
        { value: 'normal', labelKey: 'symptom_extra_urgency_normal' },
      ],
    },
    {
      key: 'involuntary_loss',
      labelKey: 'symptom_extra_urgency_involuntary_loss',
      options: YES_NO_OPTIONS,
    },
  ],
  pain_on_urination: [
    {
      key: 'burning_or_pain',
      labelKey: 'symptom_extra_pain_urination_burning_or_pain',
      options: YES_NO_OPTIONS,
    },
    {
      key: 'noticed',
      labelKey: 'symptom_extra_pain_urination_noticed',
      layout: 'grid',
      options: [
        { value: 'fever', labelKey: 'symptom_extra_digestion_fever' },
        { value: 'flank_pain', labelKey: 'symptom_extra_pain_urination_flank_pain' },
        { value: 'blood_in_urine', labelKey: 'symptom_extra_pain_urination_blood_in_urine' },
        { value: 'none', labelKey: 'symptom_extra_accompany_none' },
      ],
    },
  ],
  brain_fog: [
    {
      key: 'what_affected',
      labelKey: 'symptom_extra_brain_fog_what_affected',
      layout: 'grid',
      options: [
        { value: 'concentration', labelKey: 'symptom_extra_brain_fog_concentration' },
        { value: 'memory', labelKey: 'symptom_extra_brain_fog_memory' },
        { value: 'word_finding', labelKey: 'symptom_extra_brain_fog_word_finding' },
      ],
    },
  ],
  concentration_problems: [
    {
      key: 'during_what',
      labelKey: 'symptom_extra_concentration_during_what',
      layout: 'grid',
      options: [
        { value: 'work', labelKey: 'symptom_extra_concentration_work' },
        { value: 'reading', labelKey: 'symptom_extra_concentration_reading' },
        { value: 'daily_life', labelKey: 'symptom_extra_concentration_daily_life' },
      ],
    },
    {
      key: 'made_mistakes',
      labelKey: 'symptom_extra_concentration_made_mistakes',
      options: YES_NO_OPTIONS,
    },
  ],
  word_finding: [
    {
      key: 'how_often',
      labelKey: 'symptom_extra_word_finding_how_often',
      layout: 'grid',
      options: [
        { value: 'rarely', labelKey: 'symptom_extra_word_finding_rarely' },
        { value: 'several_daily', labelKey: 'symptom_extra_word_finding_several_daily' },
        { value: 'constantly', labelKey: 'symptom_extra_word_finding_constantly' },
      ],
    },
  ],
  forgetfulness: [
    {
      key: 'what_happened',
      labelKey: 'symptom_extra_forgetfulness_what_happened',
      layout: 'grid',
      options: [
        { value: 'forgot_appointments', labelKey: 'symptom_extra_forgetfulness_appointments' },
        { value: 'forgot_names', labelKey: 'symptom_extra_forgetfulness_names' },
        { value: 'daily_life_uncertain', labelKey: 'symptom_extra_forgetfulness_daily_uncertain' },
      ],
    },
  ],
};

export const getSymptomExtrasQuestions = (
  symptomId: SymptomId,
): readonly SymptomExtraQuestion[] => SYMPTOM_EXTRAS_CONFIG[symptomId] ?? [];
