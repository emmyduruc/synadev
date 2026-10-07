import { z } from 'zod';

export const CLINICAL_PERSISTENT_COMPLAINT_IDS = [
  'dryness',
  'libido',
  'skin_hair',
  'joint_stiffness',
  'forgetfulness',
  'digestive_patterns',
] as const;

export const ClinicalPersistentComplaintIdSchema = z
  .enum(CLINICAL_PERSISTENT_COMPLAINT_IDS)
  .describe('Persistent complaint chip id on the clinical profile screen');

export type ClinicalPersistentComplaintId = z.infer<
  typeof ClinicalPersistentComplaintIdSchema
>;

export const CLINICAL_GYNECOLOGICAL_HISTORY_IDS = [
  'pregnancies_births',
  'abdominal_pelvic_surgeries',
  'myomas_cysts_endometriosis',
  'abnormal_screening_findings',
] as const;

export const ClinicalGynecologicalHistoryIdSchema = z
  .enum(CLINICAL_GYNECOLOGICAL_HISTORY_IDS)
  .describe('Gynecological history topic id');

export type ClinicalGynecologicalHistoryId = z.infer<
  typeof ClinicalGynecologicalHistoryIdSchema
>;

export const CLINICAL_GENERAL_CONDITION_IDS = [
  'hypertension_cardiovascular',
  'diabetes_metabolic',
  'migraine',
  'thrombosis_embolism',
  'depression_anxiety',
] as const;

export const ClinicalGeneralConditionIdSchema = z
  .enum(CLINICAL_GENERAL_CONDITION_IDS)
  .describe('General pre-existing condition id');

export type ClinicalGeneralConditionId = z.infer<
  typeof ClinicalGeneralConditionIdSchema
>;

export const CLINICAL_MEDICATION_TOPIC_IDS = [
  'long_term_medication',
  'hormonal_preparations',
  'supplements',
] as const;

export const ClinicalMedicationTopicIdSchema = z
  .enum(CLINICAL_MEDICATION_TOPIC_IDS)
  .describe('Medication / preparation topic id');

export type ClinicalMedicationTopicId = z.infer<
  typeof ClinicalMedicationTopicIdSchema
>;

export const CLINICAL_LIFESTYLE_TOPIC_IDS = [
  'smoking',
  'alcohol',
  'exercise',
  'nutrition',
  'daily_stress',
] as const;

export const ClinicalLifestyleTopicIdSchema = z
  .enum(CLINICAL_LIFESTYLE_TOPIC_IDS)
  .describe('Lifestyle topic id');

export type ClinicalLifestyleTopicId = z.infer<
  typeof ClinicalLifestyleTopicIdSchema
>;

export const CLINICAL_FAMILY_HISTORY_IDS = [
  'family_cardiovascular',
  'family_osteoporosis',
  'mother_age_last_period',
] as const;

export const ClinicalFamilyHistoryIdSchema = z
  .enum(CLINICAL_FAMILY_HISTORY_IDS)
  .describe('Family history topic id');

export type ClinicalFamilyHistoryId = z.infer<
  typeof ClinicalFamilyHistoryIdSchema
>;

const NullableBooleanSchema = z
  .boolean()
  .nullable()
  .describe('Yes/No answer; null if unanswered');

export const ClinicalProfileSchema = z
  .object({
    uterusRemoved: NullableBooleanSchema.describe(
      'Whether the uterus was removed (hysterectomy)',
    ),
    ovariesRemoved: NullableBooleanSchema.describe(
      'Whether the ovaries were removed (oophorectomy)',
    ),
    endometrialAblation: NullableBooleanSchema.describe(
      'Whether endometrial ablation was performed',
    ),
    hormoneIud: NullableBooleanSchema.describe(
      'Whether a hormonal IUD is currently used',
    ),
    hormonalContraception: NullableBooleanSchema.describe(
      'Whether hormonal contraception is used',
    ),
    hormoneTherapy: NullableBooleanSchema.describe(
      'Whether hormone therapy is taken',
    ),
    thyroidDisease: NullableBooleanSchema.describe(
      'Whether a thyroid disease is present',
    ),
    ageAtFirstPeriod: z
      .number()
      .int()
      .min(8)
      .max(25)
      .nullable()
      .describe('Age at menarche; null if unanswered'),
    persistentComplaintIds: z
      .array(ClinicalPersistentComplaintIdSchema)
      .describe('Selected persistent complaint chip ids'),
    gynecologicalHistoryIds: z
      .array(ClinicalGynecologicalHistoryIdSchema)
      .describe('Selected gynecological history topic ids'),
    generalConditionIds: z
      .array(ClinicalGeneralConditionIdSchema)
      .describe('Selected general condition ids'),
    medicationTopicIds: z
      .array(ClinicalMedicationTopicIdSchema)
      .describe('Selected medication topic ids'),
    lifestyleTopicIds: z
      .array(ClinicalLifestyleTopicIdSchema)
      .describe('Selected lifestyle topic ids'),
    familyHistoryIds: z
      .array(ClinicalFamilyHistoryIdSchema)
      .describe('Selected family history topic ids'),
  })
  .describe('Clinical deepening / complete-profile document');

export type ClinicalProfile = z.infer<typeof ClinicalProfileSchema>;

export const UpdateClinicalProfileSchema = ClinicalProfileSchema.describe(
  'Replace the clinical profile (full replace)',
);

export type UpdateClinicalProfile = z.infer<typeof UpdateClinicalProfileSchema>;

export const createEmptyClinicalProfile = (): ClinicalProfile => ({
  uterusRemoved: null,
  ovariesRemoved: null,
  endometrialAblation: null,
  hormoneIud: null,
  hormonalContraception: null,
  hormoneTherapy: null,
  thyroidDisease: null,
  ageAtFirstPeriod: null,
  persistentComplaintIds: [],
  gynecologicalHistoryIds: [],
  generalConditionIds: [],
  medicationTopicIds: [],
  lifestyleTopicIds: [],
  familyHistoryIds: [],
});
