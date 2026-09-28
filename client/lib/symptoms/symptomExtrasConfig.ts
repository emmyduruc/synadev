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
};

export const getSymptomExtrasQuestions = (
  symptomId: SymptomId,
): readonly SymptomExtraQuestion[] => SYMPTOM_EXTRAS_CONFIG[symptomId] ?? [];
