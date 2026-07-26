import {
  MRS_II_ITEM_COUNT,
  MRS_II_ITEMS,
  createEmptyMrsIiAnswers,
} from './mrsIiCatalog';
import type {
  MrsIiAnswersByItem,
  MrsIiAssessmentId,
  MrsIiSeverityValue,
  MrsIiSubmissionPayload,
  MrsIiSubscores,
  MrsIiTimepoint,
} from './mrsIiTypes';
import { MRS_II_ASSESSMENT_ID, MRS_II_TIMEPOINT } from './mrsIiTypes';

export const countAnsweredMrsIiItems = (answers: MrsIiAnswersByItem): number =>
  MRS_II_ITEMS.filter((item) => answers[item.id] !== null).length;

export const isMrsIiComplete = (answers: MrsIiAnswersByItem): boolean =>
  countAnsweredMrsIiItems(answers) === MRS_II_ITEM_COUNT;

export const toMrsIiAnswerArray = (
  answers: MrsIiAnswersByItem,
): MrsIiSeverityValue[] | null => {
  if (!isMrsIiComplete(answers)) {
    return null;
  }

  return MRS_II_ITEMS.map((item) => answers[item.id] as MrsIiSeverityValue);
};

export const computeMrsIiSubscores = (
  answerArray: readonly MrsIiSeverityValue[],
): MrsIiSubscores => {
  if (answerArray.length !== MRS_II_ITEM_COUNT) {
    return { somatic: 0, psychological: 0, urogenital: 0 };
  }

  return {
    somatic: answerArray[0] + answerArray[1] + answerArray[2] + answerArray[3],
    psychological:
      answerArray[4] + answerArray[5] + answerArray[6] + answerArray[7],
    urogenital: answerArray[8] + answerArray[9] + answerArray[10],
  };
};

export const computeMrsIiTotal = (
  answerArray: readonly MrsIiSeverityValue[],
): number => answerArray.reduce<number>((sum, value) => sum + value, 0);

export const buildMrsIiSubmissionPayload = (
  answers: MrsIiAnswersByItem,
  options?: {
    assessmentId?: MrsIiAssessmentId;
    timepoint?: MrsIiTimepoint;
  },
): MrsIiSubmissionPayload | null => {
  const answerArray = toMrsIiAnswerArray(answers);

  if (!answerArray) {
    return null;
  }

  const subscores = computeMrsIiSubscores(answerArray);

  return {
    assessmentId: options?.assessmentId ?? MRS_II_ASSESSMENT_ID.baseline,
    timepoint: options?.timepoint ?? MRS_II_TIMEPOINT.t0,
    answers: answerArray,
    total: computeMrsIiTotal(answerArray),
    subscores,
  };
};

export { createEmptyMrsIiAnswers };
