import type { ComponentType } from 'react';

import { IntroFeelingIllustration } from '@/components/intro/IntroFeelingIllustration';
import { INTRO_STEP, type IntroStepId } from '@/lib/intro/constants';

export const INTRO_ILLUSTRATIONS: Record<IntroStepId, ComponentType> = {
  [INTRO_STEP.feeling]: IntroFeelingIllustration,
};
