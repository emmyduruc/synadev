import type {
  ClinicalFamilyHistoryId,
  ClinicalGeneralConditionId,
  ClinicalGynecologicalHistoryId,
  ClinicalLifestyleTopicId,
  ClinicalMedicationTopicId,
  ClinicalPersistentComplaintId,
} from '@syna/shared-types';

export type ClinicalYesNoFieldId =
  | 'uterusRemoved'
  | 'ovariesRemoved'
  | 'endometrialAblation'
  | 'hormoneIud'
  | 'hormonalContraception'
  | 'hormoneTherapy'
  | 'thyroidDisease';

export const CLINICAL_YES_NO_FIELDS: readonly {
  id: ClinicalYesNoFieldId;
  labelKey: string;
}[] = [
  { id: 'uterusRemoved', labelKey: 'clinical_profile_uterus_removed' },
  { id: 'ovariesRemoved', labelKey: 'clinical_profile_ovaries_removed' },
  {
    id: 'endometrialAblation',
    labelKey: 'clinical_profile_endometrial_ablation',
  },
  { id: 'hormoneIud', labelKey: 'clinical_profile_hormone_iud' },
  {
    id: 'hormonalContraception',
    labelKey: 'clinical_profile_hormonal_contraception',
  },
  { id: 'hormoneTherapy', labelKey: 'clinical_profile_hormone_therapy' },
  { id: 'thyroidDisease', labelKey: 'clinical_profile_thyroid_disease' },
] as const;

export const CLINICAL_PERSISTENT_COMPLAINT_OPTIONS: readonly {
  id: ClinicalPersistentComplaintId;
  labelKey: string;
}[] = [
  { id: 'dryness', labelKey: 'clinical_profile_complaint_dryness' },
  { id: 'libido', labelKey: 'clinical_profile_complaint_libido' },
  { id: 'skin_hair', labelKey: 'clinical_profile_complaint_skin_hair' },
  {
    id: 'joint_stiffness',
    labelKey: 'clinical_profile_complaint_joint_stiffness',
  },
  {
    id: 'forgetfulness',
    labelKey: 'clinical_profile_complaint_forgetfulness',
  },
  {
    id: 'digestive_patterns',
    labelKey: 'clinical_profile_complaint_digestive_patterns',
  },
] as const;

export const CLINICAL_GYNECOLOGICAL_HISTORY_OPTIONS: readonly {
  id: ClinicalGynecologicalHistoryId;
  labelKey: string;
}[] = [
  {
    id: 'pregnancies_births',
    labelKey: 'clinical_profile_gyn_pregnancies_births',
  },
  {
    id: 'abdominal_pelvic_surgeries',
    labelKey: 'clinical_profile_gyn_abdominal_pelvic_surgeries',
  },
  {
    id: 'myomas_cysts_endometriosis',
    labelKey: 'clinical_profile_gyn_myomas_cysts_endometriosis',
  },
  {
    id: 'abnormal_screening_findings',
    labelKey: 'clinical_profile_gyn_abnormal_screening_findings',
  },
] as const;

export const CLINICAL_GENERAL_CONDITION_OPTIONS: readonly {
  id: ClinicalGeneralConditionId;
  labelKey: string;
}[] = [
  {
    id: 'hypertension_cardiovascular',
    labelKey: 'clinical_profile_condition_hypertension_cardiovascular',
  },
  {
    id: 'diabetes_metabolic',
    labelKey: 'clinical_profile_condition_diabetes_metabolic',
  },
  { id: 'migraine', labelKey: 'clinical_profile_condition_migraine' },
  {
    id: 'thrombosis_embolism',
    labelKey: 'clinical_profile_condition_thrombosis_embolism',
  },
  {
    id: 'depression_anxiety',
    labelKey: 'clinical_profile_condition_depression_anxiety',
  },
] as const;

export const CLINICAL_MEDICATION_TOPIC_OPTIONS: readonly {
  id: ClinicalMedicationTopicId;
  labelKey: string;
}[] = [
  {
    id: 'long_term_medication',
    labelKey: 'clinical_profile_med_long_term',
  },
  {
    id: 'hormonal_preparations',
    labelKey: 'clinical_profile_med_hormonal',
  },
  { id: 'supplements', labelKey: 'clinical_profile_med_supplements' },
] as const;

export const CLINICAL_LIFESTYLE_TOPIC_OPTIONS: readonly {
  id: ClinicalLifestyleTopicId;
  labelKey: string;
}[] = [
  { id: 'smoking', labelKey: 'clinical_profile_lifestyle_smoking' },
  { id: 'alcohol', labelKey: 'clinical_profile_lifestyle_alcohol' },
  { id: 'exercise', labelKey: 'clinical_profile_lifestyle_exercise' },
  { id: 'nutrition', labelKey: 'clinical_profile_lifestyle_nutrition' },
  { id: 'daily_stress', labelKey: 'clinical_profile_lifestyle_daily_stress' },
] as const;

export const CLINICAL_FAMILY_HISTORY_OPTIONS: readonly {
  id: ClinicalFamilyHistoryId;
  labelKey: string;
}[] = [
  {
    id: 'family_cardiovascular',
    labelKey: 'clinical_profile_family_cardiovascular',
  },
  {
    id: 'family_osteoporosis',
    labelKey: 'clinical_profile_family_osteoporosis',
  },
  {
    id: 'mother_age_last_period',
    labelKey: 'clinical_profile_family_mother_age_last_period',
  },
] as const;

export const toggleIdInList = <T extends string>(
  list: readonly T[],
  id: T,
): T[] => {
  if (list.includes(id)) {
    return list.filter((item) => item !== id);
  }

  return [...list, id];
};
