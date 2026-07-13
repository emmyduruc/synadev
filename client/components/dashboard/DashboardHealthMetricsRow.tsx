import { ScrollView } from 'react-native';

import {
  DASHBOARD_HEALTH_METRIC_CONFIG,
  DashboardHealthMetricCard,
} from './DashboardHealthMetricCard';

import { Box } from '@/components/ui/Box';
import { ActivityIcon } from '@/components/ui/icons/ActivityIcon';
import { HrvIcon } from '@/components/ui/icons/HrvIcon';
import { SleepIcon } from '@/components/ui/icons/SleepIcon';
import { StepsIcon } from '@/components/ui/icons/StepsIcon';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { formatTodayDisplayDate } from '@/lib/date/formatDisplayDate';
import {
  DASHBOARD_HEALTH_METRIC,
  type DashboardHealthMetricDisplay,
} from '@/lib/health/healthMetricDisplay';
import { semanticColors } from '@/lib/ui';

const METRIC_ICON_SIZE = 22;

export type DashboardHealthMetricsRowProps = {
  metrics: readonly DashboardHealthMetricDisplay[];
  isConnected: boolean;
};

const METRIC_ICONS = {
  [DASHBOARD_HEALTH_METRIC.steps]: (
    <StepsIcon size={METRIC_ICON_SIZE} color={semanticColors.dashboardIcon.steps} />
  ),
  [DASHBOARD_HEALTH_METRIC.activity]: (
    <ActivityIcon size={METRIC_ICON_SIZE} color={semanticColors.dashboardIcon.activity} />
  ),
  [DASHBOARD_HEALTH_METRIC.hrv]: (
    <HrvIcon size={METRIC_ICON_SIZE} color={semanticColors.dashboardIcon.hrv} />
  ),
  [DASHBOARD_HEALTH_METRIC.sleep]: (
    <SleepIcon size={METRIC_ICON_SIZE} color={semanticColors.dashboardIcon.sleep} />
  ),
} as const;

export const DashboardHealthMetricsRow = ({
  metrics,
  isConnected,
}: DashboardHealthMetricsRowProps) => {
  const { t } = useTranslate();

  const todayLabel = formatTodayDisplayDate();

  return (
    <Box gap="sm">
      <Box direction="row" align="center" justify="between" className="gap-3">
        {!isConnected ? (
          <Text size="2xs" className="flex-1 leading-relaxed text-black">
            {t('dashboard_health_connect_hint')}
          </Text>
        ) : (
          <Box flex={1} />
        )}
        <Box
          align="center"
          justify="center"
          className="rounded-full border border-white bg-card/90 px-3 py-1 shadow-sm">
          <Text size="2xs" weight="semibold" color="foreground-muted" responsive={false}>
            {t('dashboard_health_today_label')} · {todayLabel}
          </Text>
        </Box>
      </Box>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingRight: 4 }}>
        {metrics.map((metric) => {
          const config = DASHBOARD_HEALTH_METRIC_CONFIG[metric.id];

          return (
            <DashboardHealthMetricCard
              key={metric.id}
              metric={metric}
              icon={METRIC_ICONS[metric.id]}
              labelKey={config.labelKey}
              surfaceClassName={config.surfaceClassName}
              iconBackgroundClassName={config.iconBackgroundClassName}
            />
          );
        })}
      </ScrollView>
    </Box>
  );
};
