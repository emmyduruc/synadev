/** Patient Activation Measure (13 items) Likert values.
 * Scores are 1-4 per item (not 0-based).
 * DE: stimme überhaupt nicht zu | stimme nicht zu | stimme zu | stimme voll und ganz zu
 * EN product copy: completely disagree … completely agree
 */
export const PATIENT_ACTIVATION_MEASURE_RESPONSE = {
  completelyDisagree: 1,
  ratherDisagree: 2,
  tendToAgree: 3,
  completelyAgree: 4,
} as const;

export const PATIENT_ACTIVATION_MEASURE_RESPONSE_VALUES = [
  PATIENT_ACTIVATION_MEASURE_RESPONSE.completelyDisagree,
  PATIENT_ACTIVATION_MEASURE_RESPONSE.ratherDisagree,
  PATIENT_ACTIVATION_MEASURE_RESPONSE.tendToAgree,
  PATIENT_ACTIVATION_MEASURE_RESPONSE.completelyAgree,
] as const;

export type PatientActivationMeasureResponseValue =
  (typeof PATIENT_ACTIVATION_MEASURE_RESPONSE_VALUES)[number];

export const PATIENT_ACTIVATION_MEASURE_ASSESSMENT_ID = {
  baseline: 'patient_activation_measure_baseline',
  followUp: 'patient_activation_measure',
} as const;

export type PatientActivationMeasureAssessmentId =
  (typeof PATIENT_ACTIVATION_MEASURE_ASSESSMENT_ID)[keyof typeof PATIENT_ACTIVATION_MEASURE_ASSESSMENT_ID];

export const PATIENT_ACTIVATION_MEASURE_TIMEPOINT = {
  t0: 'T0',
  t14: 'T14',
  t21: 'T21',
} as const;

export type PatientActivationMeasureTimepoint =
  (typeof PATIENT_ACTIVATION_MEASURE_TIMEPOINT)[keyof typeof PATIENT_ACTIVATION_MEASURE_TIMEPOINT];

export type PatientActivationMeasureItemId =
  | 'active_role'
  | 'active_role_priority'
  | 'know_medications'
  | 'discuss_treatment'
  | 'recognize_changes'
  | 'find_solutions'
  | 'know_exercise'
  | 'ask_doctor'
  | 'protect_health'
  | 'avoid_unhealthy'
  | 'recognize_illness_signs'
  | 'take_action'
  | 'responsible_for_health';

export type PatientActivationMeasureAnswersByItem = Record<
  PatientActivationMeasureItemId,
  PatientActivationMeasureResponseValue | null
>;

/** Payload ready for a future assessments API (server maps to 0-100). */
export type PatientActivationMeasureSubmissionPayload = {
  assessmentId: PatientActivationMeasureAssessmentId;
  timepoint: PatientActivationMeasureTimepoint;
  /** Fixed order, length 13, each value 1|2|3|4 */
  answers: PatientActivationMeasureResponseValue[];
  /** Raw sum 13-52 when complete */
  rawTotal: number;
};
