import type { SymbolViewProps } from 'expo-symbols';

export const DEEPENING_SECTION = {
  menopauseSymptoms: 'menopause_symptoms',
  gynecological: 'gynecological',
  preExisting: 'pre_existing',
  lifestyle: 'lifestyle',
  bloodPressure: 'blood_pressure',
  migraine: 'migraine',
} as const;

export type DeepeningSectionId =
  (typeof DEEPENING_SECTION)[keyof typeof DEEPENING_SECTION];

export const DEEPENING_FIELD = {
  vmsFrequency: 'vms_frequency',
  psychologicalStress: 'psychological_stress',
  sleepQuality: 'sleep_quality',
  endometriosis: 'endometriosis',
  cycleDetails: 'cycle_details',
  type2Diabetes: 'type2_diabetes',
  autoimmune: 'autoimmune',
  nafld: 'nafld',
  ckd: 'ckd',
  alcohol: 'alcohol',
  nutrition: 'nutrition',
  physicalActivity: 'physical_activity',
  bloodPressure: 'blood_pressure',
  migraine: 'migraine',
} as const;

export type DeepeningFieldId =
  (typeof DEEPENING_FIELD)[keyof typeof DEEPENING_FIELD];

export const DEEPENING_FIELD_INPUT = {
  singleSelect: 'single_select',
  text: 'text',
  number: 'number',
  bloodPressure: 'blood_pressure',
  migraine: 'migraine',
} as const;

export type DeepeningFieldInputKind =
  (typeof DEEPENING_FIELD_INPUT)[keyof typeof DEEPENING_FIELD_INPUT];

export type DeepeningFieldDefinition = {
  id: DeepeningFieldId;
  sectionId: DeepeningSectionId;
  labelKey: string;
  inputKind: DeepeningFieldInputKind;
  optionKeys?: readonly string[];
  labelKeyByOption?: Record<string, string>;
};

export type DeepeningSectionDefinition = {
  id: DeepeningSectionId;
  titleKey: string;
  icon: SymbolViewProps['name'];
  fieldIds: readonly DeepeningFieldId[];
};

export const DEEPENING_SECTIONS: readonly DeepeningSectionDefinition[] = [
  {
    id: DEEPENING_SECTION.menopauseSymptoms,
    titleKey: 'deepening_section_menopause_symptoms',
    icon: { ios: 'thermometer', android: 'thermostat', web: 'thermostat' } as SymbolViewProps['name'],
    fieldIds: [
      DEEPENING_FIELD.vmsFrequency,
      DEEPENING_FIELD.psychologicalStress,
      DEEPENING_FIELD.sleepQuality,
    ],
  },
  {
    id: DEEPENING_SECTION.gynecological,
    titleKey: 'deepening_section_gynecological',
    icon: { ios: 'leaf.fill', android: 'spa', web: 'spa' } as SymbolViewProps['name'],
    fieldIds: [DEEPENING_FIELD.endometriosis, DEEPENING_FIELD.cycleDetails],
  },
  {
    id: DEEPENING_SECTION.preExisting,
    titleKey: 'deepening_section_pre_existing',
    icon: { ios: 'heart.fill', android: 'favorite', web: 'favorite' } as SymbolViewProps['name'],
    fieldIds: [
      DEEPENING_FIELD.type2Diabetes,
      DEEPENING_FIELD.autoimmune,
      DEEPENING_FIELD.nafld,
      DEEPENING_FIELD.ckd,
    ],
  },
  {
    id: DEEPENING_SECTION.lifestyle,
    titleKey: 'deepening_section_lifestyle',
    icon: { ios: 'fork.knife', android: 'restaurant', web: 'restaurant' } as SymbolViewProps['name'],
    fieldIds: [
      DEEPENING_FIELD.alcohol,
      DEEPENING_FIELD.nutrition,
      DEEPENING_FIELD.physicalActivity,
    ],
  },
  {
    id: DEEPENING_SECTION.bloodPressure,
    titleKey: 'deepening_section_blood_pressure',
    icon: { ios: 'stethoscope', android: 'monitor_heart', web: 'monitor_heart' } as SymbolViewProps['name'],
    fieldIds: [DEEPENING_FIELD.bloodPressure],
  },
  {
    id: DEEPENING_SECTION.migraine,
    titleKey: 'deepening_section_migraine',
    icon: { ios: 'brain.head.profile', android: 'psychology', web: 'psychology' } as SymbolViewProps['name'],
    fieldIds: [DEEPENING_FIELD.migraine],
  },
];

const YES_NO_UNSURE = ['yes', 'no', 'unsure'] as const;
const YES_NO_UNSURE_LABELS = {
  yes: 'deepening_option_yes',
  no: 'deepening_option_no',
  unsure: 'deepening_option_unsure',
} as const;

export const DEEPENING_FIELDS: Record<DeepeningFieldId, DeepeningFieldDefinition> = {
  [DEEPENING_FIELD.vmsFrequency]: {
    id: DEEPENING_FIELD.vmsFrequency,
    sectionId: DEEPENING_SECTION.menopauseSymptoms,
    labelKey: 'deepening_field_vms_frequency',
    inputKind: DEEPENING_FIELD_INPUT.singleSelect,
    optionKeys: ['none', 'one_to_two', 'three_to_four', 'five_to_six', 'daily'],
    labelKeyByOption: {
      none: 'deepening_option_vms_none',
      one_to_two: 'deepening_option_vms_one_to_two',
      three_to_four: 'deepening_option_vms_three_to_four',
      five_to_six: 'deepening_option_vms_five_to_six',
      daily: 'deepening_option_vms_daily',
    },
  },
  [DEEPENING_FIELD.psychologicalStress]: {
    id: DEEPENING_FIELD.psychologicalStress,
    sectionId: DEEPENING_SECTION.menopauseSymptoms,
    labelKey: 'deepening_field_psychological_stress',
    inputKind: DEEPENING_FIELD_INPUT.singleSelect,
    optionKeys: ['low', 'moderate', 'high', 'very_high'],
    labelKeyByOption: {
      low: 'deepening_option_stress_low',
      moderate: 'deepening_option_stress_moderate',
      high: 'deepening_option_stress_high',
      very_high: 'deepening_option_stress_very_high',
    },
  },
  [DEEPENING_FIELD.sleepQuality]: {
    id: DEEPENING_FIELD.sleepQuality,
    sectionId: DEEPENING_SECTION.menopauseSymptoms,
    labelKey: 'deepening_field_sleep_quality',
    inputKind: DEEPENING_FIELD_INPUT.singleSelect,
    optionKeys: ['poor', 'fair', 'good', 'excellent'],
    labelKeyByOption: {
      poor: 'deepening_option_sleep_poor',
      fair: 'deepening_option_sleep_fair',
      good: 'deepening_option_sleep_good',
      excellent: 'deepening_option_sleep_excellent',
    },
  },
  [DEEPENING_FIELD.endometriosis]: {
    id: DEEPENING_FIELD.endometriosis,
    sectionId: DEEPENING_SECTION.gynecological,
    labelKey: 'deepening_field_endometriosis',
    inputKind: DEEPENING_FIELD_INPUT.singleSelect,
    optionKeys: YES_NO_UNSURE,
    labelKeyByOption: YES_NO_UNSURE_LABELS,
  },
  [DEEPENING_FIELD.cycleDetails]: {
    id: DEEPENING_FIELD.cycleDetails,
    sectionId: DEEPENING_SECTION.gynecological,
    labelKey: 'deepening_field_cycle_details',
    inputKind: DEEPENING_FIELD_INPUT.text,
  },
  [DEEPENING_FIELD.type2Diabetes]: {
    id: DEEPENING_FIELD.type2Diabetes,
    sectionId: DEEPENING_SECTION.preExisting,
    labelKey: 'deepening_field_type2_diabetes',
    inputKind: DEEPENING_FIELD_INPUT.singleSelect,
    optionKeys: YES_NO_UNSURE,
    labelKeyByOption: YES_NO_UNSURE_LABELS,
  },
  [DEEPENING_FIELD.autoimmune]: {
    id: DEEPENING_FIELD.autoimmune,
    sectionId: DEEPENING_SECTION.preExisting,
    labelKey: 'deepening_field_autoimmune',
    inputKind: DEEPENING_FIELD_INPUT.singleSelect,
    optionKeys: YES_NO_UNSURE,
    labelKeyByOption: YES_NO_UNSURE_LABELS,
  },
  [DEEPENING_FIELD.nafld]: {
    id: DEEPENING_FIELD.nafld,
    sectionId: DEEPENING_SECTION.preExisting,
    labelKey: 'deepening_field_nafld',
    inputKind: DEEPENING_FIELD_INPUT.singleSelect,
    optionKeys: YES_NO_UNSURE,
    labelKeyByOption: YES_NO_UNSURE_LABELS,
  },
  [DEEPENING_FIELD.ckd]: {
    id: DEEPENING_FIELD.ckd,
    sectionId: DEEPENING_SECTION.preExisting,
    labelKey: 'deepening_field_ckd',
    inputKind: DEEPENING_FIELD_INPUT.singleSelect,
    optionKeys: YES_NO_UNSURE,
    labelKeyByOption: YES_NO_UNSURE_LABELS,
  },
  [DEEPENING_FIELD.alcohol]: {
    id: DEEPENING_FIELD.alcohol,
    sectionId: DEEPENING_SECTION.lifestyle,
    labelKey: 'deepening_field_alcohol',
    inputKind: DEEPENING_FIELD_INPUT.singleSelect,
    optionKeys: ['never', 'rarely', 'weekly', 'daily'],
    labelKeyByOption: {
      never: 'deepening_option_alcohol_never',
      rarely: 'deepening_option_alcohol_rarely',
      weekly: 'deepening_option_alcohol_weekly',
      daily: 'deepening_option_alcohol_daily',
    },
  },
  [DEEPENING_FIELD.nutrition]: {
    id: DEEPENING_FIELD.nutrition,
    sectionId: DEEPENING_SECTION.lifestyle,
    labelKey: 'deepening_field_nutrition',
    inputKind: DEEPENING_FIELD_INPUT.text,
  },
  [DEEPENING_FIELD.physicalActivity]: {
    id: DEEPENING_FIELD.physicalActivity,
    sectionId: DEEPENING_SECTION.lifestyle,
    labelKey: 'deepening_field_physical_activity',
    inputKind: DEEPENING_FIELD_INPUT.number,
  },
  [DEEPENING_FIELD.bloodPressure]: {
    id: DEEPENING_FIELD.bloodPressure,
    sectionId: DEEPENING_SECTION.bloodPressure,
    labelKey: 'deepening_field_blood_pressure',
    inputKind: DEEPENING_FIELD_INPUT.bloodPressure,
  },
  [DEEPENING_FIELD.migraine]: {
    id: DEEPENING_FIELD.migraine,
    sectionId: DEEPENING_SECTION.migraine,
    labelKey: 'deepening_field_migraine',
    inputKind: DEEPENING_FIELD_INPUT.migraine,
  },
};

export const DEEPENING_FIELD_IDS: readonly DeepeningFieldId[] =
  DEEPENING_SECTIONS.flatMap((section) => section.fieldIds);

export const DEEPENING_ENTRY_TOTAL = DEEPENING_FIELD_IDS.length;

export const MIGRAINE_DIAGNOSIS = {
  diagnosed: 'diagnosed',
  regularHeadaches: 'regular_headaches',
  no: 'no',
  preferNot: 'prefer_not',
} as const;

export const MIGRAINE_DIAGNOSIS_OPTIONS = [
  MIGRAINE_DIAGNOSIS.diagnosed,
  MIGRAINE_DIAGNOSIS.regularHeadaches,
  MIGRAINE_DIAGNOSIS.no,
  MIGRAINE_DIAGNOSIS.preferNot,
] as const;

export const MIGRAINE_DIAGNOSIS_LABEL_KEYS = {
  [MIGRAINE_DIAGNOSIS.diagnosed]: 'deepening_migraine_diagnosis_diagnosed',
  [MIGRAINE_DIAGNOSIS.regularHeadaches]: 'deepening_migraine_diagnosis_regular',
  [MIGRAINE_DIAGNOSIS.no]: 'deepening_migraine_diagnosis_no',
  [MIGRAINE_DIAGNOSIS.preferNot]: 'deepening_migraine_diagnosis_prefer_not',
} as const;

export const MIGRAINE_AURA = {
  withAura: 'with_aura',
  withoutAura: 'without_aura',
  unknown: 'unknown',
} as const;

export const MIGRAINE_AURA_OPTIONS = [
  MIGRAINE_AURA.withAura,
  MIGRAINE_AURA.withoutAura,
  MIGRAINE_AURA.unknown,
] as const;

export const MIGRAINE_AURA_LABEL_KEYS = {
  [MIGRAINE_AURA.withAura]: 'deepening_migraine_aura_with',
  [MIGRAINE_AURA.withoutAura]: 'deepening_migraine_aura_without',
  [MIGRAINE_AURA.unknown]: 'deepening_migraine_aura_unknown',
} as const;

export const MIGRAINE_HRT = {
  current: 'current',
  planned: 'planned',
  never: 'never',
} as const;

export const MIGRAINE_HRT_OPTIONS = [
  MIGRAINE_HRT.current,
  MIGRAINE_HRT.planned,
  MIGRAINE_HRT.never,
] as const;

export const MIGRAINE_HRT_LABEL_KEYS = {
  [MIGRAINE_HRT.current]: 'deepening_migraine_hrt_current',
  [MIGRAINE_HRT.planned]: 'deepening_migraine_hrt_planned',
  [MIGRAINE_HRT.never]: 'deepening_migraine_hrt_never',
} as const;
