import type { ReactNode } from 'react';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { cn } from '@/lib/ui';

export type DashboardQuickActionButtonProps = {
  label: string;
  icon: ReactNode;
  iconWellClassName: string;
  surfaceClassName: string;
  onPress: () => void;
};

export const DashboardQuickActionButton = ({
  label,
  icon,
  iconWellClassName,
  surfaceClassName,
  onPress,
}: DashboardQuickActionButtonProps) => (
  <TouchableOpacity
    accessibilityRole="button"
    onPress={onPress}
    className={cn(surfaceClassName, 'w-[100px] shrink-0 items-center px-2 py-3')}>
    <Box
      align="center"
      justify="center"
      className={cn('mb-2 h-11 w-11 rounded-full', iconWellClassName)}>
      {icon}
    </Box>
    <Text size="2xs" weight="medium" align="center" responsive={false} className="leading-tight">
      {label}
    </Text>
  </TouchableOpacity>
);
