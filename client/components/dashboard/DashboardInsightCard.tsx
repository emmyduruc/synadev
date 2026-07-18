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
    <Box className={cn('mr-3 w-[227px] rounded-3xl px-3.5 py-3', backgroundClassName)}>
      <Text size="2xs" weight="semibold" className="tracking-wide">
        {eyebrow}
      </Text>
      <Box
        align="center"
        justify="center"
        className={cn('my-2.5 h-11 w-11 rounded-full', DASHBOARD_ICON_WELL.insight)}>
        {icon}
      </Box>
      <Text size="sm" weight="bold" className="leading-tight">
        {title}
      </Text>
      <Text size="2xs" color="foreground-muted" className="mt-1 leading-snug" numberOfLines={2}>
        {description}
      </Text>
    </Box>
  </TouchableOpacity>
);
