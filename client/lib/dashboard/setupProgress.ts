export const DASHBOARD_SETUP_STEP = {
  health: 'health',
  mrsIi: 'mrs_ii',
  pam13: 'pam_13',
} as const;

export type DashboardSetupStepId =
  (typeof DASHBOARD_SETUP_STEP)[keyof typeof DASHBOARD_SETUP_STEP];

export const DASHBOARD_SETUP_STEPS = [
  DASHBOARD_SETUP_STEP.health,
  DASHBOARD_SETUP_STEP.mrsIi,
  DASHBOARD_SETUP_STEP.pam13,
] as const;

export type DashboardSetupStepState = {
  id: DashboardSetupStepId;
  isCompleted: boolean;
  isCurrent: boolean;
};

export const getDashboardSetupSteps = (completed: {
  health: boolean;
  mrsIi: boolean;
  pam13: boolean;
}): readonly DashboardSetupStepState[] => {
  const completionById: Record<DashboardSetupStepId, boolean> = {
    [DASHBOARD_SETUP_STEP.health]: completed.health,
    [DASHBOARD_SETUP_STEP.mrsIi]: completed.mrsIi,
    [DASHBOARD_SETUP_STEP.pam13]: completed.pam13,
  };

  const currentId =
    DASHBOARD_SETUP_STEPS.find((stepId) => !completionById[stepId]) ?? null;

  return DASHBOARD_SETUP_STEPS.map((stepId) => ({
    id: stepId,
    isCompleted: completionById[stepId],
    isCurrent: currentId === stepId,
  }));
};
