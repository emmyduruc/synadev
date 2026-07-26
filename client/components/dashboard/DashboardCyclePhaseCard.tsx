import type { CyclePhaseSnapshotDto } from '@syna/shared-types';
import { useRouter } from 'expo-router';

import { CyclePhaseAnimatedIcon } from '@/components/dashboard/CyclePhaseAnimatedIcon';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { DASHBOARD_SURFACE } from '@/lib/dashboard/surfaces';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/ui';

export type DashboardCyclePhaseCardProps = {
  snapshot: CyclePhaseSnapshotDto | null;
  isLoading?: boolean;
};

const phaseTitleKey = (phase: NonNullable<CyclePhaseSnapshotDto['phase']>) => {
  if (phase === 'period') {
    return 'dashboard_cycle_phase_period';
  }

  if (phase === 'follicular') {
    return 'dashboard_cycle_phase_follicular';
  }

  if (phase === 'ovulation') {
    return 'dashboard_cycle_phase_ovulation';
  }

  return 'dashboard_cycle_phase_luteal';
};

const phaseHintKey = (phase: NonNullable<CyclePhaseSnapshotDto['phase']>) => {
  if (phase === 'period') {
    return 'dashboard_cycle_phase_hint_period';
  }

  if (phase === 'follicular') {
    return 'dashboard_cycle_phase_hint_follicular';
  }

  if (phase === 'ovulation') {
    return 'dashboard_cycle_phase_hint_ovulation';
  }

  return 'dashboard_cycle_phase_hint_luteal';
};

export const DashboardCyclePhaseCard = ({
  snapshot,
  isLoading = false,
}: DashboardCyclePhaseCardProps) => {
  const { t } = useTranslate();
  const router = useRouter();
  const phase = snapshot?.phase ?? null;
  const hasPhase = phase !== null;

  const title = (() => {
    if (isLoading || !hasPhase) {
      return t('dashboard_cycle_phase_unknown');
    }

    return t(phaseTitleKey(phase));
  })();

  const hint = hasPhase ? t(phaseHintKey(phase)) : t('dashboard_cycle_phase_hint');

  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={() => {
        router.push(ROUTES.recordPeriod);
      }}
      className={cn(DASHBOARD_SURFACE.blushCard, 'p-5')}>
      <Box gap="sm">
        <Box direction="row" align="center" gap="md">
          <Box flex={1} gap="xs">
            <Text
              size="2xs"
              weight="semibold"
              color="foreground"
              className="uppercase tracking-wide">
              {t('dashboard_cycle_phase_label')}
            </Text>
            <Text size="2xl" weight="bold">
              {title}
            </Text>
          </Box>
          <CyclePhaseAnimatedIcon phase={phase} />
        </Box>
        <Text size="xs" color="foreground" className="leading-relaxed">
          {hint}
        </Text>
        {hasPhase ? (
          <Text size="2xs" color="foreground" className="leading-relaxed">
            {t('dashboard_cycle_phase_disclaimer')}
          </Text>
        ) : null}
      </Box>
    </TouchableOpacity>
  );
};
