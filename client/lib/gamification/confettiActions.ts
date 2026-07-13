import { semanticColors } from '@/lib/ui';

export const CONFETTI_ACTION = {
  healthConnected: 'health_connected',
  bioDataCompleted: 'bio_data_completed',
  periodLogged: 'period_logged',
  symptomsLogged: 'symptoms_logged',
  moodLogged: 'mood_logged',
  dailyCheckInCompleted: 'daily_check_in_completed',
  wizardCompleted: 'wizard_completed',
  profileCompleted: 'profile_completed',
} as const;

export type ConfettiAction = (typeof CONFETTI_ACTION)[keyof typeof CONFETTI_ACTION];

/**
 * Actions that deserve a celebratory confetti burst.
 * Keep this list intentional — not every tap should celebrate.
 */
export const CONFETTI_WORTHY_ACTIONS: readonly ConfettiAction[] = [
  CONFETTI_ACTION.healthConnected,
  CONFETTI_ACTION.bioDataCompleted,
  CONFETTI_ACTION.periodLogged,
  CONFETTI_ACTION.symptomsLogged,
  CONFETTI_ACTION.moodLogged,
  CONFETTI_ACTION.dailyCheckInCompleted,
  CONFETTI_ACTION.wizardCompleted,
  CONFETTI_ACTION.profileCompleted,
];

export const isConfettiWorthyAction = (action: ConfettiAction): boolean =>
  CONFETTI_WORTHY_ACTIONS.includes(action);

export const CONFETTI_PALETTE = {
  default: [
    semanticColors.splashBackground,
    semanticColors.ovum.lavender,
    semanticColors.ovum.apricot,
    semanticColors.ovum.sageMist,
    semanticColors.ovum.dustyRose,
  ],
  health: [
    semanticColors.ovum.sageMist,
    semanticColors.ovum.lavender,
    semanticColors.splashBackground,
  ],
  mood: [
    semanticColors.ovum.apricot,
    semanticColors.ovum.dustyRose,
    semanticColors.ovum.lavender,
  ],
  period: [
    semanticColors.splashBackground,
    semanticColors.ovum.dustyRose,
    semanticColors.ovum.apricot,
  ],
} as const;

export const getConfettiPaletteForAction = (
  action: ConfettiAction,
): readonly string[] => {
  if (
    action === CONFETTI_ACTION.healthConnected ||
    action === CONFETTI_ACTION.bioDataCompleted ||
    action === CONFETTI_ACTION.profileCompleted
  ) {
    return CONFETTI_PALETTE.health;
  }

  if (action === CONFETTI_ACTION.moodLogged || action === CONFETTI_ACTION.dailyCheckInCompleted) {
    return CONFETTI_PALETTE.mood;
  }

  if (action === CONFETTI_ACTION.periodLogged) {
    return CONFETTI_PALETTE.period;
  }

  return CONFETTI_PALETTE.default;
};
