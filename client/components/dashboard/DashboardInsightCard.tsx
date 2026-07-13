import type { ReactNode } from 'react';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { DASHBOARD_ICON_WELL } from '@/lib/dashboard/surfaces';
import { cn } from '@/lib/ui';

export type DashboardInsightCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  backgroundClassName: string;
};

export const DashboardInsightCard = ({
  eyebrow,
  title,
  description,
  icon,
  backgroundClassName,
}: DashboardInsightCardProps) => (
  <Box className={cn('mr-3 w-[220px] rounded-3xl p-4', backgroundClassName)}>
    <Text size="2xs" weight="semibold" className="uppercase tracking-wide">
      {eyebrow}
    </Text>
    <Box
      align="center"
      justify="center"
      className={cn('my-4 h-16 w-16 rounded-full', DASHBOARD_ICON_WELL.insight)}>
      {icon}
    </Box>
    <Text size="lg" weight="bold" className="leading-tight">
      {title}
    </Text>
    <Text size="xs" color="foreground-muted" className="mt-2 leading-relaxed">
      {description}
    </Text>
  </Box>
);
