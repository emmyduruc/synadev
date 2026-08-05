import { z } from 'zod';

/** Assessment instruments persisted in `assessment_submissions.instrument`. */
export const ASSESSMENT_INSTRUMENT = {
  mrsIi: 'mrs_ii',
  pam13: 'pam13',
} as const;

export const ASSESSMENT_INSTRUMENTS = [
  ASSESSMENT_INSTRUMENT.mrsIi,
  ASSESSMENT_INSTRUMENT.pam13,
] as const;

export type AssessmentInstrument =
  (typeof ASSESSMENT_INSTRUMENTS)[number];

export const AssessmentInstrumentSchema = z
  .enum(ASSESSMENT_INSTRUMENTS)
  .describe('Clinical questionnaire instrument identifier');

export const ASSESSMENT_TIMEPOINT = {
  t0: 'T0',
  t14: 'T14',
  t21: 'T21',
} as const;

export const ASSESSMENT_TIMEPOINTS = [
  ASSESSMENT_TIMEPOINT.t0,
  ASSESSMENT_TIMEPOINT.t14,
  ASSESSMENT_TIMEPOINT.t21,
] as const;

export type AssessmentTimepoint = (typeof ASSESSMENT_TIMEPOINTS)[number];

export const AssessmentTimepointSchema = z
  .enum(ASSESSMENT_TIMEPOINTS)
  .describe('Study timepoint for this submission (baseline or follow-up)');

// ---------------------------------------------------------------------------
// MRS-II
// ---------------------------------------------------------------------------

export const MRS_II_ASSESSMENT_ID = {
  baseline: 'mrs2_baseline',
  followUp: 'mrs2',
} as const;

export const MRS_II_ASSESSMENT_IDS = [
  MRS_II_ASSESSMENT_ID.baseline,
  MRS_II_ASSESSMENT_ID.followUp,
] as const;

export type MrsIiAssessmentId = (typeof MRS_II_ASSESSMENT_IDS)[number];

export const MrsIiAssessmentIdSchema = z
  .enum(MRS_II_ASSESSMENT_IDS)
  .describe('MRS-II assessment variant (baseline or follow-up)');

/** Fixed MRS-II item order — do not reorder. */
export const MRS_II_ITEM_KEYS = [
  'hot_flushes',
  'heart_discomfort',
  'sleep_problems',
  'joint_muscular_discomfort',
  'depressive_mood',
  'irritability',
  'anxiety',
  'physical_mental_exhaustion',
  'sexual_problems',
  'bladder_problems',
  'vaginal_dryness',
] as const;

export type MrsIiItemKey = (typeof MRS_II_ITEM_KEYS)[number];

export const MRS_II_ITEM_COUNT = MRS_II_ITEM_KEYS.length;

export const MrsIiSeverityValueSchema = z
  .number()
  .int()
  .min(0)
  .max(4)
  .describe('MRS-II item severity 0 (none) to 4 (very severe)');

export type MrsIiSeverityValue = z.infer<typeof MrsIiSeverityValueSchema>;

export const MrsIiAnswersSchema = z
  .array(MrsIiSeverityValueSchema)
  .length(MRS_II_ITEM_COUNT)
  .describe('MRS-II answers in fixed instrument order (11 values, each 0-4)');

export const MrsIiSubscoresSchema = z
  .object({
    somatic: z.number().int().min(0).max(16).describe('Sum of somatic items (0-16)'),
    psychological: z
      .number()
      .int()
      .min(0)
      .max(16)
      .describe('Sum of psychological items (0-16)'),
    urogenital: z
      .number()
      .int()
      .min(0)
      .max(12)
      .describe('Sum of urogenital items (0-12)'),
  })
  .describe('MRS-II subscale scores recomputed on the server');

export type MrsIiSubscores = z.infer<typeof MrsIiSubscoresSchema>;

export const SubmitMrsIiAssessmentSchema = z
  .object({
    assessmentId: MrsIiAssessmentIdSchema,
    timepoint: AssessmentTimepointSchema,
    answers: MrsIiAnswersSchema,
  })
  .describe('Submit a completed MRS-II questionnaire (server recomputes scores)');

export type SubmitMrsIiAssessment = z.infer<typeof SubmitMrsIiAssessmentSchema>;

export const MrsIiAssessmentSubmissionSchema = z
  .object({
    id: z.string().uuid().describe('Submission id'),
    assessmentId: MrsIiAssessmentIdSchema,
    timepoint: AssessmentTimepointSchema,
    answers: MrsIiAnswersSchema,
    total: z.number().int().min(0).max(44).describe('Total MRS-II score (0-44)'),
    subscores: MrsIiSubscoresSchema,
    completedAt: z.string().datetime().describe('ISO timestamp when saved'),
  })
  .describe('Persisted MRS-II submission with server-computed scores');

export type MrsIiAssessmentSubmission = z.infer<typeof MrsIiAssessmentSubmissionSchema>;

export const MrsIiLatestSchema = z
  .object({
    submission: MrsIiAssessmentSubmissionSchema.nullable().describe(
      'Most recent MRS-II submission, or null if none',
    ),
  })
  .describe('Latest MRS-II submission for the authenticated user');

export type MrsIiLatest = z.infer<typeof MrsIiLatestSchema>;

export const computeMrsIiSubscores = (
  answers: readonly MrsIiSeverityValue[],
): MrsIiSubscores => {
  if (answers.length !== MRS_II_ITEM_COUNT) {
    return { somatic: 0, psychological: 0, urogenital: 0 };
  }

  return {
    somatic: answers[0] + answers[1] + answers[2] + answers[3],
    psychological: answers[4] + answers[5] + answers[6] + answers[7],
    urogenital: answers[8] + answers[9] + answers[10],
  };
};

export const computeMrsIiTotal = (
  answers: readonly MrsIiSeverityValue[],
): number => answers.reduce<number>((sum, value) => sum + value, 0);

// ---------------------------------------------------------------------------
// Patient Activation Measure (PAM-13)
// ---------------------------------------------------------------------------

export const PAM13_ASSESSMENT_ID = {
  baseline: 'patient_activation_measure_baseline',
  followUp: 'patient_activation_measure',
} as const;

export const PAM13_ASSESSMENT_IDS = [
  PAM13_ASSESSMENT_ID.baseline,
  PAM13_ASSESSMENT_ID.followUp,
] as const;

export type Pam13AssessmentId = (typeof PAM13_ASSESSMENT_IDS)[number];

export const Pam13AssessmentIdSchema = z
  .enum(PAM13_ASSESSMENT_IDS)
  .describe('PAM-13 assessment variant (baseline or follow-up)');

/** Fixed PAM-13 item order — do not reorder. */
export const PAM13_ITEM_KEYS = [
  'active_role',
  'active_role_priority',
  'know_medications',
  'discuss_treatment',
  'recognize_changes',
  'find_solutions',
  'know_exercise',
  'ask_doctor',
  'protect_health',
  'avoid_unhealthy',
  'recognize_illness_signs',
  'take_action',
  'responsible_for_health',
] as const;

export type Pam13ItemKey = (typeof PAM13_ITEM_KEYS)[number];

export const PAM13_ITEM_COUNT = PAM13_ITEM_KEYS.length;

export const Pam13ResponseValueSchema = z
  .number()
  .int()
  .min(1)
  .max(4)
  .describe('PAM-13 Likert response 1 (completely disagree) to 4 (completely agree)');

export type Pam13ResponseValue = z.infer<typeof Pam13ResponseValueSchema>;

export const Pam13AnswersSchema = z
  .array(Pam13ResponseValueSchema)
  .length(PAM13_ITEM_COUNT)
  .describe('PAM-13 answers in fixed instrument order (13 values, each 1-4)');

export const SubmitPam13AssessmentSchema = z
  .object({
    assessmentId: Pam13AssessmentIdSchema,
    timepoint: AssessmentTimepointSchema,
    answers: Pam13AnswersSchema,
  })
  .describe('Submit a completed PAM-13 questionnaire (server recomputes raw total)');

export type SubmitPam13Assessment = z.infer<typeof SubmitPam13AssessmentSchema>;

export const Pam13AssessmentSubmissionSchema = z
  .object({
    id: z.string().uuid().describe('Submission id'),
    assessmentId: Pam13AssessmentIdSchema,
    timepoint: AssessmentTimepointSchema,
    answers: Pam13AnswersSchema,
    rawTotal: z
      .number()
      .int()
      .min(13)
      .max(52)
      .describe('Raw PAM-13 sum (13-52); 0-100 mapping may be added later'),
    scaledScore: z
      .number()
      .min(0)
      .max(100)
      .nullable()
      .describe('Official 0-100 scaled score when mapping is configured'),
    completedAt: z.string().datetime().describe('ISO timestamp when saved'),
  })
  .describe('Persisted PAM-13 submission with server-computed raw total');

export type Pam13AssessmentSubmission = z.infer<typeof Pam13AssessmentSubmissionSchema>;

export const Pam13LatestSchema = z
  .object({
    submission: Pam13AssessmentSubmissionSchema.nullable().describe(
      'Most recent PAM-13 submission, or null if none',
    ),
  })
  .describe('Latest PAM-13 submission for the authenticated user');

export type Pam13Latest = z.infer<typeof Pam13LatestSchema>;

export const computePam13RawTotal = (
  answers: readonly Pam13ResponseValue[],
): number => answers.reduce<number>((sum, value) => sum + value, 0);
