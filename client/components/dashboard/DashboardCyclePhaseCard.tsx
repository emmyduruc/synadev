import { Box } from '@/components/ui/Box';
import { BloodDropIcon } from '@/components/ui/icons/BloodDropIcon';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { DASHBOARD_ICON_WELL, DASHBOARD_SURFACE } from '@/lib/dashboard/surfaces';
import { cn, semanticColors } from '@/lib/ui';

export const DashboardCyclePhaseCard = () => {
  const { t } = useTranslate();

  return (
    <Box
      direction="row"
      align="center"
      gap="md"
      className={cn(DASHBOARD_SURFACE.blushCard, 'p-5')}>
      <Box flex={1} gap="xs">
        <Text size="2xs" weight="semibold" color="foreground-muted" className="uppercase tracking-wide">
          {t('dashboard_cycle_phase_label')}
        </Text>
        <Text size="2xl" weight="bold">
          {t('dashboard_cycle_phase_unknown')}
        </Text>
        <Text size="xs" color="foreground-muted" className="leading-relaxed">
          {t('dashboard_cycle_phase_hint')}
        </Text>
      </Box>
      <Box
        align="center"
        justify="center"
        className={cn('h-14 w-14 rounded-full', DASHBOARD_ICON_WELL.roseGem)}>
        <BloodDropIcon size={28} color={semanticColors.dashboardIcon.cycle} />
      </Box>
    </Box>
  );
};
