import type { SymptomId } from '@syna/shared-types';

export type SymptomExtraOption = {
  value: string;
  labelKey: string;
};

export type SymptomExtraQuestion = {
  key: string;
  labelKey: string;
  options: readonly SymptomExtraOption[];
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
};

export const getSymptomExtrasQuestions = (
  symptomId: SymptomId,
): readonly SymptomExtraQuestion[] => SYMPTOM_EXTRAS_CONFIG[symptomId] ?? [];
