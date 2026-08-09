import { useMemo } from 'react';

import { useDashboardHealth } from '@/hooks/useDashboardHealth';
import { useMenopauseScaleBanner } from '@/hooks/useMenopauseScaleBanner';
import { usePatientActivationMeasureBanner } from '@/hooks/usePatientActivationMeasureBanner';
import {
  getDashboardSetupSteps,
  type DashboardSetupStepId,
} from '@/lib/dashboard/setupProgress';

export type DashboardSetupCtaAction = DashboardSetupStepId;

export const useDashboardSetupProgress = () => {
  const health = useDashboardHealth();
  const {
    isCompleted: isMrsCompleted,
    isLoading: isMrsLoading,
    refresh: refreshMrs,
  } = useMenopauseScaleBanner();
  const {
    isCompleted: isPamCompleted,
    isLoading: isPamLoading,
    refresh: refreshPam,
  } = usePatientActivationMeasureBanner();

  const isLoading = isMrsLoading || isPamLoading;

  const steps = useMemo(
    () =>
      getDashboardSetupSteps({
        health: health.isConnected,
        mrsIi: isMrsCompleted,
        pam13: isPamCompleted,
      }),
    [health.isConnected, isMrsCompleted, isPamCompleted],
  );

  const currentStep = steps.find((step) => step.isCurrent) ?? null;
  const completedCount = steps.filter((step) => step.isCompleted).length;
  const totalCount = steps.length;
  const isFullyComplete = completedCount === totalCount;

  return {
    ...health,
    steps,
    currentStep,
    currentStepId: currentStep?.id ?? null,
    completedCount,
    totalCount,
    isFullyComplete,
    isSetupLoading: isLoading,
    refreshAssessments: async () => {
      await Promise.all([refreshMrs(), refreshPam()]);
    },
    ctaAction: (currentStep?.id ?? null) as DashboardSetupCtaAction | null,
  };
};
