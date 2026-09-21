export const INTRO_STEP = {
  feeling: 'feeling',
  timeline: 'timeline',
} as const;

export type IntroStepId = (typeof INTRO_STEP)[keyof typeof INTRO_STEP];

/** Total conversion intro pages (step 3 follows). */
export const INTRO_TOTAL_STEPS = 3;
