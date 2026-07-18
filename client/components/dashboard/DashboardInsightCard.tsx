import type { ReactNode } from 'react';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { DASHBOARD_ICON_WELL } from '@/lib/dashboard/surfaces';
import { cn } from '@/lib/ui';

export type DashboardInsightCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  backgroundClassName: string;
  onPress?: () => void;
};

export const DashboardInsightCard = ({
  eyebrow,
  title,
  description,
  icon,
  backgroundClassName,
  onPress,
}: DashboardInsightCardProps) => (
  <TouchableOpacity
    accessibilityRole="button"
    activeOpacity={0.92}
    disabled={!onPress}
    onPress={onPress}>
    <Box className={cn('mr-3 w-[220px] max-h-[200px] rounded-3xl p-4', backgroundClassName)}>
    <Text size="xs" weight="semibold" className="tracking-wide">
      {eyebrow}
    </Text>
    <Box
      align="center"
      justify="center"
      className={cn('my-4 h-16 w-16 rounded-full', DASHBOARD_ICON_WELL.insight)}>
      {icon}
    </Box>
    <Text size="xs" weight="bold" className="leading-tight">
      {title}
    </Text>
    <Text size="xs" color="foreground-muted" className="mt-2 leading-relaxed">
      {description}
    </Text>
    </Box>
  </TouchableOpacity>
);
