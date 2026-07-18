import type { ReactNode } from 'react';

import { FlameIcon } from '@/components/ui/icons/FlameIcon';
import { FlowerIcon } from '@/components/ui/icons/FlowerIcon';
import { InsightPatternIcon } from '@/components/ui/icons/InsightPatternIcon';
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
  switch (iconKey) {
    case 'sleep':
      return <SleepIcon size={size} color={color} />;
    case 'flame':
      return <FlameIcon size={size} color={color} />;
    case 'flower':
      return <FlowerIcon size={size} color={color} />;
    case 'pattern':
    default:
      return <InsightPatternIcon size={size} color={color} />;
  }
};
