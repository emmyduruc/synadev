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
  DASHBOARD_HEALTH_METRIC,
  type DashboardHealthMetricDisplay,
} from '@/lib/health/healthMetricDisplay';
import { semanticColors } from '@/lib/ui';

export type DashboardHealthMetricsRowProps = {
  metrics: readonly DashboardHealthMetricDisplay[];
  isConnected: boolean;
};

const METRIC_ICONS = {
  [DASHBOARD_HEALTH_METRIC.steps]: (
    <StepsIcon size={18} color={semanticColors.dashboardIcon.steps} />
  ),
  [DASHBOARD_HEALTH_METRIC.activity]: (
    <ActivityIcon size={18} color={semanticColors.dashboardIcon.activity} />
  ),
  [DASHBOARD_HEALTH_METRIC.hrv]: <HrvIcon size={18} color={semanticColors.dashboardIcon.hrv} />,
  [DASHBOARD_HEALTH_METRIC.sleep]: (
    <SleepIcon size={18} color={semanticColors.dashboardIcon.sleep} />
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
        <Text size="2xs" className="leading-relaxed text-black">
          {t('dashboard_health_connect_hint')}
        </Text>
      ) : null}
      <Box direction="row" gap="sm" className="flex-wrap">
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
      </Box>
    </Box>
  );
};
