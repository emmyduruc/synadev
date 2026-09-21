export const INTRO_STEP = {
  feeling: 'feeling',
  timeline: 'timeline',
  appointment: 'appointment',
} as const;

export type IntroStepId = (typeof INTRO_STEP)[keyof typeof INTRO_STEP];

export const INTRO_TOTAL_STEPS = 3;
