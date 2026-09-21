import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { INTRO_ILLUSTRATIONS } from '@/components/intro/introIllustrations';
import { INTRO_STEPS } from '@/lib/intro/introSteps';
import { setIntroCompleted } from '@/lib/intro/introStorage';
import { ROUTES } from '@/lib/routes';

export const useIntroFlow = () => {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);

  const step = INTRO_STEPS[stepIndex];
  const Illustration = INTRO_ILLUSTRATIONS[step.id];
  const isLastStep = stepIndex >= INTRO_STEPS.length - 1;

  const goFurther = useCallback(async () => {
    if (!isLastStep) {
      setStepIndex((current) => current + 1);
      return;
    }

    await setIntroCompleted();
    router.replace(ROUTES.welcome);
  }, [isLastStep, router]);

  return {
    currentStep: stepIndex + 1,
    titleKey: step.titleKey,
    bodyKey: step.bodyKey,
    Illustration,
    goFurther,
  };
};
