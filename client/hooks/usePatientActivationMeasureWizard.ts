import { useCallback, useMemo, useState } from 'react';

import {
  PATIENT_ACTIVATION_MEASURE_ITEMS,
  createEmptyPatientActivationMeasureAnswers,
} from '@/lib/patientActivationMeasure/patientActivationMeasureCatalog';
import {
  buildPatientActivationMeasureSubmissionPayload,
  countAnsweredPatientActivationMeasureItems,
  isPatientActivationMeasureComplete,
} from '@/lib/patientActivationMeasure/patientActivationMeasureScoring';
import type {
  PatientActivationMeasureAnswersByItem,
  PatientActivationMeasureItemId,
  PatientActivationMeasureResponseValue,
  PatientActivationMeasureSubmissionPayload,
} from '@/lib/patientActivationMeasure/patientActivationMeasureTypes';

export const PATIENT_ACTIVATION_MEASURE_WIZARD_PHASE = {
  intro: 'intro',
  questions: 'questions',
} as const;

export type PatientActivationMeasureWizardPhase =
  (typeof PATIENT_ACTIVATION_MEASURE_WIZARD_PHASE)[keyof typeof PATIENT_ACTIVATION_MEASURE_WIZARD_PHASE];

export const usePatientActivationMeasureWizard = () => {
  const [phase, setPhase] = useState<PatientActivationMeasureWizardPhase>(
    PATIENT_ACTIVATION_MEASURE_WIZARD_PHASE.intro,
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<PatientActivationMeasureAnswersByItem>(
    createEmptyPatientActivationMeasureAnswers,
  );
  const [isSaving, setIsSaving] = useState(false);

  const currentItem =
    PATIENT_ACTIVATION_MEASURE_ITEMS[questionIndex] ??
    PATIENT_ACTIVATION_MEASURE_ITEMS[0];
  const answeredCount = useMemo(
    () => countAnsweredPatientActivationMeasureItems(answers),
    [answers],
  );
  const isComplete = useMemo(
    () => isPatientActivationMeasureComplete(answers),
    [answers],
  );
  const isLastQuestion =
    questionIndex >= PATIENT_ACTIVATION_MEASURE_ITEMS.length - 1;
  const currentAnswer = answers[currentItem.id];
  const canAdvanceQuestion = currentAnswer !== null;

  const setItemAnswer = useCallback(
    (
      itemId: PatientActivationMeasureItemId,
      value: PatientActivationMeasureResponseValue,
    ) => {
      setAnswers((previous) => ({ ...previous, [itemId]: value }));
    },
    [],
  );

  const goToQuestions = useCallback(() => {
    setPhase(PATIENT_ACTIVATION_MEASURE_WIZARD_PHASE.questions);
    setQuestionIndex(0);
  }, []);

  const goToIntro = useCallback(() => {
    setPhase(PATIENT_ACTIVATION_MEASURE_WIZARD_PHASE.intro);
  }, []);

  const goToPreviousQuestion = useCallback(() => {
    setQuestionIndex((previous) => Math.max(0, previous - 1));
  }, []);

  const goToNextQuestion = useCallback(() => {
    setQuestionIndex((previous) =>
      Math.min(PATIENT_ACTIVATION_MEASURE_ITEMS.length - 1, previous + 1),
    );
  }, []);

  const buildPayload =
    useCallback((): PatientActivationMeasureSubmissionPayload | null => {
      return buildPatientActivationMeasureSubmissionPayload(answers);
    }, [answers]);

  return {
    phase,
    questionIndex,
    currentItem,
    answers,
    answeredCount,
    isComplete,
    isLastQuestion,
    currentAnswer,
    canAdvanceQuestion,
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
