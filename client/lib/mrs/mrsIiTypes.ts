/** MRS-II response values: identical 0-4 scale for every item.
 * Canonical German labels (ZEG Berlin / menopause-rating-scale.info):
 * 0 keine, 1 leicht, 2 mittel, 3 stark, 4 sehr stark
 * English official translation: None, Mild, Moderate, Severe, Very severe
 * Do not use PAM-13 agree/disagree labels here.
 */
export const MRS_II_SEVERITY = {
  none: 0,
  mild: 1,
  moderate: 2,
  severe: 3,
  verySevere: 4,
} as const;

export const MRS_II_SEVERITY_VALUES = [
  MRS_II_SEVERITY.none,
  MRS_II_SEVERITY.mild,
  MRS_II_SEVERITY.moderate,
  MRS_II_SEVERITY.severe,
  MRS_II_SEVERITY.verySevere,
] as const;

export type MrsIiSeverityValue = (typeof MRS_II_SEVERITY_VALUES)[number];

export const MRS_II_ASSESSMENT_ID = {
  baseline: 'mrs2_baseline',
  followUp: 'mrs2',
} as const;

export type MrsIiAssessmentId =
  (typeof MRS_II_ASSESSMENT_ID)[keyof typeof MRS_II_ASSESSMENT_ID];

export const MRS_II_TIMEPOINT = {
  t0: 'T0',
  t14: 'T14',
  t21: 'T21',
} as const;

export type MrsIiTimepoint = (typeof MRS_II_TIMEPOINT)[keyof typeof MRS_II_TIMEPOINT];

export const MRS_II_SUBSCALE = {
  somatic: 'somatic',
  psychological: 'psychological',
  urogenital: 'urogenital',
} as const;

export type MrsIiSubscaleId = (typeof MRS_II_SUBSCALE)[keyof typeof MRS_II_SUBSCALE];

export type MrsIiItemId =
  | 'hot_flushes'
  | 'heart_discomfort'
  | 'sleep_problems'
  | 'joint_muscular_discomfort'
  | 'depressive_mood'
  | 'irritability'
  | 'anxiety'
  | 'physical_mental_exhaustion'
  | 'sexual_problems'
  | 'bladder_problems'
  | 'vaginal_dryness';

/** Answers keyed by item id — null means unanswered. */
export type MrsIiAnswersByItem = Record<MrsIiItemId, MrsIiSeverityValue | null>;

export type MrsIiSubscores = {
  somatic: number;
  psychological: number;
  urogenital: number;
};

/** Payload ready for a future POST /assessments/mrs-ii (server recomputes scores). */
export type MrsIiSubmissionPayload = {
  assessmentId: MrsIiAssessmentId;
  timepoint: MrsIiTimepoint;
  answers: MrsIiSeverityValue[];
  total: number;
  subscores: MrsIiSubscores;
};
