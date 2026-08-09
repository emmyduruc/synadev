import { useState } from 'react';

import { DashboardSetupProgressNode } from '@/components/dashboard/DashboardSetupProgressNode';
import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import {
  DASHBOARD_SETUP_STEP,
  type DashboardSetupStepId,
  type DashboardSetupStepState,
} from '@/lib/dashboard/setupProgress';
import { DASHBOARD_SURFACE } from '@/lib/dashboard/surfaces';
import { cn } from '@/lib/ui';

export type DashboardSetupProgressProps = {
  steps: readonly DashboardSetupStepState[];
  completedCount: number;
  totalCount: number;
  currentStepId: DashboardSetupStepId | null;
  isConnectingHealth: boolean;
  healthErrorMessage: string | null;
  onConnectHealth: () => void;
  onStartMrsIi: () => void;
  onStartPam13: () => void;
};

const stepLabelKey = (stepId: DashboardSetupStepId): string => {
  if (stepId === DASHBOARD_SETUP_STEP.health) {
    return 'dashboard_setup_step_health';
  }

  if (stepId === DASHBOARD_SETUP_STEP.mrsIi) {
    return 'dashboard_setup_step_mrs_ii';
  }

  return 'dashboard_setup_step_pam_13';
};

const stepWhyKey = (
  stepId: DashboardSetupStepId,
  isCompleted: boolean,
): string => {
  if (isCompleted) {
    if (stepId === DASHBOARD_SETUP_STEP.health) {
      return 'dashboard_setup_why_health_done';
    }

    if (stepId === DASHBOARD_SETUP_STEP.mrsIi) {
      return 'dashboard_setup_why_mrs_ii_done';
    }

    return 'dashboard_setup_why_pam_13_done';
  }

  if (stepId === DASHBOARD_SETUP_STEP.health) {
    return 'dashboard_setup_why_health';
  }

  if (stepId === DASHBOARD_SETUP_STEP.mrsIi) {
    return 'dashboard_setup_why_mrs_ii';
  }

  return 'dashboard_setup_why_pam_13';
};

export const DashboardSetupProgress = ({
  steps,
  completedCount,
  totalCount,
  currentStepId,
  isConnectingHealth,
  healthErrorMessage,
  onConnectHealth,
  onStartMrsIi,
  onStartPam13,
}: DashboardSetupProgressProps) => {
  const { t } = useTranslate();
  const [selectedStepId, setSelectedStepId] = useState<DashboardSetupStepId | null>(
    null,
  );

  if (completedCount === totalCount) {
    return (
      <Box className={cn(DASHBOARD_SURFACE.sageCard, 'px-3 py-2.5')}>
        <Text size="xs" weight="semibold" align="center">
          {t('dashboard_setup_complete_title')}
        </Text>
      </Box>
    );
  }

  let titleKey = 'dashboard_setup_title';
  let ctaLabelKey = 'dashboard_setup_cta_health';
  let onPressCta = onConnectHealth;
  let ctaLoading = isConnectingHealth;

  if (currentStepId === DASHBOARD_SETUP_STEP.mrsIi) {
    titleKey = 'dashboard_setup_title_mrs_ii';
    ctaLabelKey = 'dashboard_setup_cta_mrs_ii';
    onPressCta = onStartMrsIi;
    ctaLoading = false;
  } else if (currentStepId === DASHBOARD_SETUP_STEP.pam13) {
    titleKey = 'dashboard_setup_title_pam_13';
    ctaLabelKey = 'dashboard_setup_cta_pam_13';
    onPressCta = onStartPam13;
    ctaLoading = false;
  }

  const selectedStep = selectedStepId
    ? steps.find((step) => step.id === selectedStepId)
    : null;

  const handleNodePress = (stepId: DashboardSetupStepId) => {
    setSelectedStepId((current) => (current === stepId ? null : stepId));
  };

  return (
    <Box gap="sm" className={cn(DASHBOARD_SURFACE.sageCard, 'px-3 py-3')}>
      <Box direction="row" align="center" justify="between" className="gap-2">
        <Text size="xs" weight="bold" className="flex-1 leading-tight">
          {t(titleKey)}
        </Text>
        <Text size="2xs" weight="semibold" color="foreground-muted">
          {t('dashboard_setup_progress_label', {
            completed: completedCount,
            total: totalCount,
          })}
        </Text>
      </Box>

      <Box direction="row" align="start" justify="center" className="w-full">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const connectorClassName = step.isCompleted
            ? 'bg-success-500'
            : 'bg-error-300';

          return (
            <Box key={step.id} direction="row" align="start">
              <DashboardSetupProgressNode
                label={t(stepLabelKey(step.id))}
                isCompleted={step.isCompleted}
                isCurrent={step.isCurrent}
                isSelected={selectedStepId === step.id}
                onPress={() => {
                  handleNodePress(step.id);
                }}
              />
              {isLast ? null : (
                <Box
                  className={cn('mt-3.5 h-0.5 w-5 rounded-full', connectorClassName)}
                />
              )}
            </Box>
          );
        })}
      </Box>

      {selectedStep ? (
        <Box
          className={cn(
            DASHBOARD_SURFACE.nestedLift,
            'relative px-3 py-2',
            selectedStep.isCompleted
              ? 'border-success-500/30'
              : 'border-error-500/30',
          )}>
          <Box
            className={cn(
              'absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-l border-t bg-card',
              selectedStep.isCompleted
                ? 'border-success-500/30'
                : 'border-error-500/30',
            )}
          />
          <Text size="2xs" weight="semibold" className="mb-0.5 leading-tight">
            {t(stepLabelKey(selectedStep.id))}
          </Text>
          <Text size="2xs" color="foreground" className="leading-snug">
            {t(stepWhyKey(selectedStep.id, selectedStep.isCompleted))}
          </Text>
        </Box>
      ) : null}

      {healthErrorMessage && currentStepId === DASHBOARD_SETUP_STEP.health ? (
        <Text size="2xs" color="error" className="leading-snug">
          {healthErrorMessage}
        </Text>
      ) : null}

      <Button fullWidth size="sm" loading={ctaLoading} onPress={onPressCta}>
        {t(ctaLabelKey)}
      </Button>
    </Box>
  );
};
