import { INTRO_STEP, type IntroStepId } from '@/lib/intro/constants';

export type IntroStepConfig = {
  id: IntroStepId;
  titleKey: string;
  bodyKey: string;
};

/**
 * Conversion intro steps. Step 3 will be appended when its design lands.
 */
export const INTRO_STEPS: readonly IntroStepConfig[] = [
  {
    id: INTRO_STEP.feeling,
    titleKey: 'intro_step_feeling_title',
    bodyKey: 'intro_step_feeling_body',
  },
  {
    id: INTRO_STEP.timeline,
    titleKey: 'intro_step_timeline_title',
    bodyKey: 'intro_step_timeline_body',
  },
] as const;
