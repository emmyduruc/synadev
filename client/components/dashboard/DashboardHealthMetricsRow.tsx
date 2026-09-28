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
import {
  dashboardHorizontalScrollContentStyle,
  dashboardHorizontalScrollStyle,
} from '@/lib/dashboard/horizontalScrollStyles';
import {
  DASHBOARD_HEALTH_METRIC,
  type DashboardHealthMetricDisplay,
} from '@/lib/health/healthMetricDisplay';
import { semanticColors } from '@/lib/ui';

const METRIC_ICON_SIZE = 18;

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

  return (
    <Box gap="sm">
      {!isConnected ? (
        <Text size="2xs" color="foreground" className="leading-relaxed">
          {t('dashboard_health_connect_hint')}
        </Text>
      ) : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={dashboardHorizontalScrollStyle}
        contentContainerStyle={[dashboardHorizontalScrollContentStyle, { gap: 12, paddingRight: 4 }]}>
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
