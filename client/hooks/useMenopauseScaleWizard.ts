import { useCallback, useMemo, useState } from 'react';

import {
  createEmptyMrsIiAnswers,
  MRS_II_ITEM_COUNT,
  MRS_II_ITEMS,
} from '@/lib/mrs/mrsIiCatalog';
import {
  buildMrsIiSubmissionPayload,
  countAnsweredMrsIiItems,
  isMrsIiComplete,
} from '@/lib/mrs/mrsIiScoring';
import type {
  MrsIiAnswersByItem,
  MrsIiItemId,
  MrsIiSeverityValue,
  MrsIiSubmissionPayload,
} from '@/lib/mrs/mrsIiTypes';

export const useMenopauseScaleWizard = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<MrsIiAnswersByItem>(createEmptyMrsIiAnswers);
  const [isSaving, setIsSaving] = useState(false);

  const currentItem = MRS_II_ITEMS[questionIndex] ?? MRS_II_ITEMS[0];
  const currentAnswer = answers[currentItem.id];
  const answeredCount = useMemo(() => countAnsweredMrsIiItems(answers), [answers]);
  const isComplete = useMemo(() => isMrsIiComplete(answers), [answers]);
  const isLastQuestion = questionIndex >= MRS_II_ITEM_COUNT - 1;
  const questionNumber = questionIndex + 1;

  const setItemAnswer = useCallback(
    (itemId: MrsIiItemId, value: MrsIiSeverityValue) => {
      setAnswers((previous) => ({ ...previous, [itemId]: value }));
    },
    [],
  );

  const goToNextQuestion = useCallback(() => {
    setQuestionIndex((previous) =>
      Math.min(previous + 1, MRS_II_ITEM_COUNT - 1),
    );
  }, []);

  const goToPreviousQuestion = useCallback(() => {
    setQuestionIndex((previous) => Math.max(previous - 1, 0));
  }, []);

  const buildPayload = useCallback((): MrsIiSubmissionPayload | null => {
    return buildMrsIiSubmissionPayload(answers);
  }, [answers]);

  return {
    questionIndex,
    questionNumber,
    currentItem,
    currentAnswer,
    answers,
    answeredCount,
    isComplete,
    isLastQuestion,
    isSaving,
    setIsSaving,
    setItemAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    buildPayload,
  };
};
