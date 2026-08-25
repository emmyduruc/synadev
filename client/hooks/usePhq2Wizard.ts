import type { Phq2SeverityValue, SubmitPhq2Assessment } from '@syna/shared-types';
import { useCallback, useMemo, useState } from 'react';

import {
  buildPhq2SubmissionPayload,
  createEmptyPhq2Answers,
  isPhq2Complete,
  PHQ2_ITEMS,
  type Phq2AnswersByItem,
  type Phq2ItemId,
} from '@/lib/phq2/phq2Catalog';

export const PHQ2_WIZARD_PHASE = {
  intro: 'intro',
  questions: 'questions',
} as const;

export type Phq2WizardPhase =
  (typeof PHQ2_WIZARD_PHASE)[keyof typeof PHQ2_WIZARD_PHASE];

export const usePhq2Wizard = () => {
  const [phase, setPhase] = useState<Phq2WizardPhase>(PHQ2_WIZARD_PHASE.intro);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Phq2AnswersByItem>(createEmptyPhq2Answers);
  const [isSaving, setIsSaving] = useState(false);

  const currentItem = PHQ2_ITEMS[questionIndex] ?? PHQ2_ITEMS[0];
  const isComplete = useMemo(() => isPhq2Complete(answers), [answers]);
  const isLastQuestion = questionIndex >= PHQ2_ITEMS.length - 1;
  const currentAnswer = answers[currentItem.id];
  const canAdvanceQuestion = currentAnswer !== null;

  const setItemAnswer = useCallback(
    (itemId: Phq2ItemId, value: Phq2SeverityValue) => {
      setAnswers((previous) => ({ ...previous, [itemId]: value }));
    },
    [],
  );

  const goToQuestions = useCallback(() => {
    setPhase(PHQ2_WIZARD_PHASE.questions);
    setQuestionIndex(0);
  }, []);

  const goToIntro = useCallback(() => {
    setPhase(PHQ2_WIZARD_PHASE.intro);
  }, []);

  const goToPreviousQuestion = useCallback(() => {
    setQuestionIndex((previous) => Math.max(0, previous - 1));
  }, []);

  const goToNextQuestion = useCallback(() => {
    setQuestionIndex((previous) => Math.min(PHQ2_ITEMS.length - 1, previous + 1));
  }, []);

  const buildPayload = useCallback((): SubmitPhq2Assessment | null => {
    return buildPhq2SubmissionPayload(answers);
  }, [answers]);

  return {
    phase,
    currentItem,
    currentAnswer,
    canAdvanceQuestion,
    isLastQuestion,
    isComplete,
    isSaving,
    setIsSaving,
    setItemAnswer,
    goToQuestions,
    goToIntro,
    goToPreviousQuestion,
    goToNextQuestion,
    buildPayload,
  };
};
