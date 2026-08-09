import type { CyclePhaseId } from '@syna/shared-types';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import type { CycleInsightsNextPhase } from '@/lib/cycle/cycleInsightsProgress';
import { DASHBOARD_SURFACE } from '@/lib/dashboard/surfaces';
import { cn } from '@/lib/ui';

export type CycleInsightsNextPhaseCardProps = {
  nextPhase: CycleInsightsNextPhase | null;
  cycleDay: number | null;
  cycleLengthDays: number;
};

const nextPhaseTitleKey = (phase: CyclePhaseId) => {
  if (phase === 'period') {
    return 'cycle_insights_next_phase_period';
  }

  if (phase === 'follicular') {
    return 'cycle_insights_next_phase_follicular';
  }

  if (phase === 'ovulation') {
    return 'cycle_insights_next_phase_ovulation';
  }

  return 'cycle_insights_next_phase_luteal';
};

export const CycleInsightsNextPhaseCard = ({
  nextPhase,
  cycleDay,
  cycleLengthDays,
}: CycleInsightsNextPhaseCardProps) => {
  const { t } = useTranslate();

  if (!nextPhase || cycleDay === null) {
    return (
      <Box className={cn(DASHBOARD_SURFACE.lavenderShell, 'gap-1 p-4')}>
        <Text size="2xs" weight="semibold" color="foreground-muted">
          {t('cycle_insights_next_phase_label')}
        </Text>
        <Text size="sm" weight="semibold">
          {t('cycle_insights_next_phase_unknown')}
        </Text>
      </Box>
    );
  }

  return (
    <Box className={cn(DASHBOARD_SURFACE.lavenderShell, 'gap-2 p-4')}>
      <Text size="2xs" weight="semibold" color="foreground-muted">
        {t('cycle_insights_next_phase_label')}
      </Text>
      <Box direction="row" align="end" justify="between" gap="md">
        <Box flex={1} gap="xs">
          <Text size="lg" weight="bold">
            {t(nextPhaseTitleKey(nextPhase.phase))}
          </Text>
          <Text size="xs" color="foreground" className="leading-snug">
            {t('cycle_insights_next_phase_in_days', { days: nextPhase.daysUntil })}
          </Text>
        </Box>
        <Box align="end" className="rounded-2xl bg-card/80 px-3 py-2">
          <Text size="2xs" color="foreground-muted">
            {t('cycle_insights_progress_chip_label')}
          </Text>
          <Text size="sm" weight="bold" color="primary">
            {t('cycle_insights_progress_chip_value', {
              day: cycleDay,
              length: cycleLengthDays,
            })}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
