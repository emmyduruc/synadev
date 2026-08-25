import {
  ASSESSMENT_TIMEPOINT,
  PHQ2_ASSESSMENT_ID,
  PHQ2_ITEM_KEYS,
  type Phq2SeverityValue,
  type SubmitPhq2Assessment,
} from '@syna/shared-types';

export type Phq2ItemId = (typeof PHQ2_ITEM_KEYS)[number];

export type Phq2Item = {
  id: Phq2ItemId;
  index: number;
  titleKey: string;
};

export const PHQ2_ITEMS: readonly Phq2Item[] = [
  {
    id: 'little_interest',
    index: 1,
    titleKey: 'phq2_item_little_interest',
  },
  {
    id: 'feeling_down',
    index: 2,
    titleKey: 'phq2_item_feeling_down',
  },
];

export const PHQ2_RESPONSE_VALUES = [0, 1, 2, 3] as const;

export type Phq2AnswersByItem = Record<Phq2ItemId, Phq2SeverityValue | null>;

export const createEmptyPhq2Answers = (): Phq2AnswersByItem => ({
  little_interest: null,
  feeling_down: null,
});

export const PHQ2_RESPONSE_LABEL_KEYS: Record<Phq2SeverityValue, string> = {
  0: 'phq2_response_0',
  1: 'phq2_response_1',
  2: 'phq2_response_2',
  3: 'phq2_response_3',
};

export const isPhq2Complete = (answers: Phq2AnswersByItem): boolean =>
  PHQ2_ITEM_KEYS.every((key) => answers[key] !== null);

export const buildPhq2SubmissionPayload = (
  answers: Phq2AnswersByItem,
): SubmitPhq2Assessment | null => {
  if (!isPhq2Complete(answers)) {
    return null;
  }

  return {
    assessmentId: PHQ2_ASSESSMENT_ID.baseline,
    timepoint: ASSESSMENT_TIMEPOINT.t0,
    answers: PHQ2_ITEM_KEYS.map((key) => answers[key] as Phq2SeverityValue),
  };
};
