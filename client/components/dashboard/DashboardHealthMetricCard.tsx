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
    <Box
      direction="row"
      align="center"
      gap="sm"
      className={cn(surfaceClassName, 'w-[148px] shrink-0 px-3 py-2.5')}>
      <Box
        align="center"
        justify="center"
        className={cn('h-9 w-9 shrink-0 rounded-full', iconBackgroundClassName)}>
        {icon}
      </Box>
      <Box flex={1} className="min-w-0">
        <Text size="base" weight="bold" responsive={false} className="leading-tight" numberOfLines={1}>
          {metric.value}
        </Text>
        <Text
          size="2xs"
          color="foreground-muted"
          responsive={false}
          className="mt-0.5 leading-tight"
          numberOfLines={1}>
          {t(labelKey)}
        </Text>
        {metric.trendDirection ? (
          <Text size="2xs" color="foreground-muted" responsive={false} className="mt-0.5">
            {getTrendSymbol(metric.trendDirection)} {t('dashboard_health_trend_label')}
          </Text>
        ) : null}
      </Box>
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
