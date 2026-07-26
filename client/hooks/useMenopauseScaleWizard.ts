import { useCallback, useMemo, useState } from 'react';

import { createEmptyMrsIiAnswers } from '@/lib/mrs/mrsIiCatalog';
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

export const MRS_II_WIZARD_STEP = {
  intro: 'intro',
  questionnaire: 'questionnaire',
} as const;

export type MrsIiWizardStep =
  (typeof MRS_II_WIZARD_STEP)[keyof typeof MRS_II_WIZARD_STEP];

export const useMenopauseScaleWizard = () => {
  const [step, setStep] = useState<MrsIiWizardStep>(MRS_II_WIZARD_STEP.intro);
  const [answers, setAnswers] = useState<MrsIiAnswersByItem>(createEmptyMrsIiAnswers);
  const [isSaving, setIsSaving] = useState(false);

  const answeredCount = useMemo(() => countAnsweredMrsIiItems(answers), [answers]);
  const isComplete = useMemo(() => isMrsIiComplete(answers), [answers]);

  const setItemAnswer = useCallback(
    (itemId: MrsIiItemId, value: MrsIiSeverityValue) => {
      setAnswers((previous) => ({ ...previous, [itemId]: value }));
    },
    [],
  );

  const goToQuestionnaire = useCallback(() => {
    setStep(MRS_II_WIZARD_STEP.questionnaire);
  }, []);

  const goToIntro = useCallback(() => {
    setStep(MRS_II_WIZARD_STEP.intro);
  }, []);

  const buildPayload = useCallback((): MrsIiSubmissionPayload | null => {
    return buildMrsIiSubmissionPayload(answers);
  }, [answers]);

  return {
    step,
    answers,
    answeredCount,
    isComplete,
    isSaving,
    setIsSaving,
    setItemAnswer,
    goToQuestionnaire,
    goToIntro,
    buildPayload,
  };
};
