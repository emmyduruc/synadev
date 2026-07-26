import {
  PATIENT_ACTIVATION_MEASURE_ITEM_COUNT,
  PATIENT_ACTIVATION_MEASURE_ITEMS,
  createEmptyPatientActivationMeasureAnswers,
} from './patientActivationMeasureCatalog';
import type {
  PatientActivationMeasureAnswersByItem,
  PatientActivationMeasureAssessmentId,
  PatientActivationMeasureResponseValue,
  PatientActivationMeasureSubmissionPayload,
  PatientActivationMeasureTimepoint,
} from './patientActivationMeasureTypes';
import {
  PATIENT_ACTIVATION_MEASURE_ASSESSMENT_ID,
  PATIENT_ACTIVATION_MEASURE_TIMEPOINT,
} from './patientActivationMeasureTypes';

export const countAnsweredPatientActivationMeasureItems = (
  answers: PatientActivationMeasureAnswersByItem,
): number =>
  PATIENT_ACTIVATION_MEASURE_ITEMS.filter((item) => answers[item.id] !== null).length;

export const isPatientActivationMeasureComplete = (
  answers: PatientActivationMeasureAnswersByItem,
): boolean =>
  countAnsweredPatientActivationMeasureItems(answers) ===
  PATIENT_ACTIVATION_MEASURE_ITEM_COUNT;

export const toPatientActivationMeasureAnswerArray = (
  answers: PatientActivationMeasureAnswersByItem,
): PatientActivationMeasureResponseValue[] | null => {
  if (!isPatientActivationMeasureComplete(answers)) {
    return null;
  }

  return PATIENT_ACTIVATION_MEASURE_ITEMS.map(
    (item) => answers[item.id] as PatientActivationMeasureResponseValue,
  );
};

export const computePatientActivationMeasureRawTotal = (
  answerArray: readonly PatientActivationMeasureResponseValue[],
): number => answerArray.reduce<number>((sum, value) => sum + value, 0);

export const buildPatientActivationMeasureSubmissionPayload = (
  answers: PatientActivationMeasureAnswersByItem,
  options?: {
    assessmentId?: PatientActivationMeasureAssessmentId;
    timepoint?: PatientActivationMeasureTimepoint;
  },
): PatientActivationMeasureSubmissionPayload | null => {
  const answerArray = toPatientActivationMeasureAnswerArray(answers);

  if (!answerArray) {
    return null;
  }

  return {
    assessmentId:
      options?.assessmentId ?? PATIENT_ACTIVATION_MEASURE_ASSESSMENT_ID.baseline,
    timepoint: options?.timepoint ?? PATIENT_ACTIVATION_MEASURE_TIMEPOINT.t0,
    answers: answerArray,
    rawTotal: computePatientActivationMeasureRawTotal(answerArray),
  };
};

export { createEmptyPatientActivationMeasureAnswers };
