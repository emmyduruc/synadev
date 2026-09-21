export const INTRO_STEP = {
  feeling: 'feeling',
} as const;

export type IntroStepId = (typeof INTRO_STEP)[keyof typeof INTRO_STEP];

/** Total conversion intro pages (step 1 shipped; 2 and 3 follow). */
export const INTRO_TOTAL_STEPS = 3;
