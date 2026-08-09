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
  const cycleDay = snapshot?.cycleDay ?? null;
  const isPeriodPhase = phase === 'period';

  const title = (() => {
    if (isLoading || !hasPhase) {
      return t('dashboard_cycle_phase_unknown');
    }

    return t(phaseTitleKey(phase));
  })();

  const hint = hasPhase ? t(phaseHintKey(phase)) : t('dashboard_cycle_phase_hint');

  return (
    <Box className={cn(DASHBOARD_SURFACE.blushCard, 'gap-3 p-4')}>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => {
          router.push(ROUTES.cycleInsights);
        }}>
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
              <Text size="xl" weight="bold">
                {title}
              </Text>
              {cycleDay !== null ? (
                <Text size="2xs" weight="semibold" color="primary">
                  {t('dashboard_cycle_phase_day', { day: cycleDay })}
                </Text>
              ) : null}
            </Box>
            <CyclePhaseAnimatedIcon phase={phase} />
          </Box>
          <Text size="xs" color="foreground" className="leading-relaxed">
            {hint}
          </Text>
          <Text size="2xs" weight="semibold" color="primary">
            {t('dashboard_cycle_phase_open_insights')}
          </Text>
        </Box>
      </TouchableOpacity>

      {isPeriodPhase ? (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={t('dashboard_cycle_phase_period_ended')}
          onPress={() => {
            router.push(ROUTES.periodEnded);
          }}
          className="rounded-2xl border border-primary-200 bg-card/80 px-3 py-2.5">
          <Text size="xs" weight="semibold" color="primary" align="center">
            {t('dashboard_cycle_phase_period_ended')}
          </Text>
        </TouchableOpacity>
      ) : null}
    </Box>
  );
};
