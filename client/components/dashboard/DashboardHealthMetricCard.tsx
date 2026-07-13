import type { ReactNode } from 'react';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { DASHBOARD_ICON_WELL, DASHBOARD_HEALTH_METRIC_SURFACE } from '@/lib/dashboard/surfaces';
import {
  DASHBOARD_HEALTH_METRIC,
  type DashboardHealthMetricDisplay,
  type HealthTrendDirection,
} from '@/lib/health/healthMetricDisplay';
import { cn } from '@/lib/ui';

export type DashboardHealthMetricCardProps = {
  metric: DashboardHealthMetricDisplay;
  icon: ReactNode;
  labelKey: string;
  surfaceClassName: string;
  iconBackgroundClassName: string;
};

const getTrendSymbol = (direction: HealthTrendDirection | null): string => {
  if (direction === 'up') {
    return '↑';
  }

  if (direction === 'down') {
    return '↓';
  }

  return '•';
};

export const DashboardHealthMetricCard = ({
  metric,
  icon,
  labelKey,
  surfaceClassName,
  iconBackgroundClassName,
}: DashboardHealthMetricCardProps) => {
  const { t } = useTranslate();

  return (
    <Box className={cn(surfaceClassName, 'w-[108px] shrink-0 px-3.5 py-3.5')}>
      <Box
        align="center"
        justify="center"
        className={cn('mb-2.5 h-11 w-11 rounded-full', iconBackgroundClassName)}>
        {icon}
      </Box>
      <Text size="lg" weight="bold" align="center" responsive={false} className="leading-tight">
        {metric.value}
      </Text>
      <Text size="2xs" color="foreground-muted" align="center" responsive={false} className="mt-1">
        {t(labelKey)}
      </Text>
      {metric.trendDirection ? (
        <Text size="2xs" color="foreground-muted" align="center" responsive={false} className="mt-1">
          {getTrendSymbol(metric.trendDirection)} {t('dashboard_health_trend_label')}
        </Text>
      ) : null}
    </Box>
  );
};

export const DASHBOARD_HEALTH_METRIC_CONFIG = {
  [DASHBOARD_HEALTH_METRIC.steps]: {
    labelKey: 'health_metric_steps',
    surfaceClassName: DASHBOARD_HEALTH_METRIC_SURFACE.steps,
    iconBackgroundClassName: DASHBOARD_ICON_WELL.steps,
  },
  [DASHBOARD_HEALTH_METRIC.activity]: {
    labelKey: 'health_metric_exercise_minutes',
    surfaceClassName: DASHBOARD_HEALTH_METRIC_SURFACE.activity,
    iconBackgroundClassName: DASHBOARD_ICON_WELL.activity,
  },
  [DASHBOARD_HEALTH_METRIC.hrv]: {
    labelKey: 'health_metric_hrv',
    surfaceClassName: DASHBOARD_HEALTH_METRIC_SURFACE.hrv,
    iconBackgroundClassName: DASHBOARD_ICON_WELL.hrv,
  },
  [DASHBOARD_HEALTH_METRIC.sleep]: {
    labelKey: 'health_metric_sleep',
    surfaceClassName: DASHBOARD_HEALTH_METRIC_SURFACE.sleep,
    iconBackgroundClassName: DASHBOARD_ICON_WELL.sleep,
  },
} as const;
