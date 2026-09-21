import { INTRO_STEP, type IntroStepId } from '@/lib/intro/constants';

export type IntroStepConfig = {
  id: IntroStepId;
  titleKey: string;
  bodyKey: string;
};

/**
 * Conversion intro steps. Only step 1 is fully designed so far.
 * Steps 2 and 3 will be appended when their designs land.
 */
export const INTRO_STEPS: readonly IntroStepConfig[] = [
  {
    id: INTRO_STEP.feeling,
    titleKey: 'intro_step_feeling_title',
    bodyKey: 'intro_step_feeling_body',
  },
] as const;
