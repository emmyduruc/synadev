import type { CyclePhaseId } from '@syna/shared-types';

import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { DASHBOARD_SURFACE } from '@/lib/dashboard/surfaces';
import { cn } from '@/lib/ui';

export type CycleInsightsTipsCardProps = {
  phase: CyclePhaseId | null;
  nextPeriodDateLabel: string | null;
  daysUntilNextPeriod: number | null;
  onLogSymptoms: () => void;
};

const tipKeysForPhase = (phase: CyclePhaseId | null) => {
  if (phase === 'period') {
    return {
      body: 'cycle_insights_tip_period',
      exercise: 'cycle_insights_exercise_period',
      nutrition: 'cycle_insights_nutrition_period',
      midlife: 'cycle_insights_midlife_period',
    };
  }

  if (phase === 'follicular') {
    return {
      body: 'cycle_insights_tip_follicular',
      exercise: 'cycle_insights_exercise_follicular',
      nutrition: 'cycle_insights_nutrition_follicular',
      midlife: 'cycle_insights_midlife_follicular',
    };
  }

  if (phase === 'ovulation') {
    return {
      body: 'cycle_insights_tip_ovulation',
      exercise: 'cycle_insights_exercise_ovulation',
      nutrition: 'cycle_insights_nutrition_ovulation',
      midlife: 'cycle_insights_midlife_ovulation',
    };
  }

  if (phase === 'luteal') {
    return {
      body: 'cycle_insights_tip_luteal',
      exercise: 'cycle_insights_exercise_luteal',
      nutrition: 'cycle_insights_nutrition_luteal',
      midlife: 'cycle_insights_midlife_luteal',
    };
  }

  return {
    body: 'cycle_insights_tip_unknown',
    exercise: 'cycle_insights_exercise_unknown',
    nutrition: 'cycle_insights_nutrition_unknown',
    midlife: 'cycle_insights_midlife_unknown',
  };
};

export const CycleInsightsTipsCard = ({
  phase,
  nextPeriodDateLabel,
  daysUntilNextPeriod,
  onLogSymptoms,
}: CycleInsightsTipsCardProps) => {
  const { t } = useTranslate();
  const tipKeys = tipKeysForPhase(phase);

  return (
    <Box gap="sm" className={cn(DASHBOARD_SURFACE.blushCard, 'p-4')}>
      <Text size="2xs" weight="semibold" color="foreground-muted">
        {t('cycle_insights_phase_section_label')}
      </Text>
      <Text size="sm" weight="bold">
        {t(tipKeys.body)}
      </Text>

      <Box className={cn(DASHBOARD_SURFACE.nestedLift, 'gap-3 p-3')}>
        <Box gap="xs">
          <Text size="2xs" weight="semibold" color="primary">
            {t('cycle_insights_exercise_label')}
          </Text>
          <Text size="xs" color="foreground" className="leading-snug">
            {t(tipKeys.exercise)}
          </Text>
        </Box>
        <Box gap="xs">
          <Text size="2xs" weight="semibold" color="primary">
            {t('cycle_insights_nutrition_label')}
          </Text>
          <Text size="xs" color="foreground" className="leading-snug">
            {t(tipKeys.nutrition)}
          </Text>
        </Box>
        <Box gap="xs">
          <Text size="2xs" weight="semibold" color="primary">
            {t('cycle_insights_midlife_label')}
          </Text>
          <Text size="xs" color="foreground" className="leading-snug">
            {t(tipKeys.midlife)}
          </Text>
        </Box>
      </Box>

      {nextPeriodDateLabel && daysUntilNextPeriod !== null ? (
        <Text size="2xs" color="foreground-muted" className="leading-snug">
          {t('cycle_insights_next_period', {
            date: nextPeriodDateLabel,
            days: daysUntilNextPeriod,
          })}
        </Text>
      ) : null}

      <Button fullWidth variant="outline" size="sm" onPress={onLogSymptoms}>
        {t('cycle_insights_log_symptoms_button')}
      </Button>

      <Text size="2xs" color="foreground-muted" className="leading-snug">
        {t('cycle_insights_disclaimer')}
      </Text>
    </Box>
  );
};
