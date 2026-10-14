import type { ReactNode } from 'react';

import { FlameIcon } from '@/components/ui/icons/FlameIcon';
import { FlowerIcon } from '@/components/ui/icons/FlowerIcon';
import { HrvIcon } from '@/components/ui/icons/HrvIcon';
import { InsightPatternIcon } from '@/components/ui/icons/InsightPatternIcon';
import { PeriodIcon } from '@/components/ui/icons/PeriodIcon';
import { SleepIcon } from '@/components/ui/icons/SleepIcon';
import type { InsightIconKey } from '@/lib/insights/constants';
import { semanticColors } from '@/lib/ui';

export type InsightIconProps = {
  size?: number;
  color?: string;
};

export const renderInsightIcon = (
  iconKey: InsightIconKey,
  { size = 32, color = semanticColors.dashboardIcon.insight }: InsightIconProps = {},
): ReactNode => {
  if (iconKey === 'sleep') {
    return <SleepIcon size={size} color={color} />;
  }

  if (iconKey === 'flame') {
    return <FlameIcon size={size} color={color} />;
  }

  if (iconKey === 'flower') {
    return <FlowerIcon size={size} color={color} />;
  }

  if (iconKey === 'hrv') {
    return <HrvIcon size={size} color={color} />;
  }

  if (iconKey === 'period') {
    return <PeriodIcon size={size} color={color} />;
  }

  return <InsightPatternIcon size={size} color={color} />;
};
