import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/ui';

export const TAG_ICON_POSITION = {
  left: 'left',
  right: 'right',
  none: 'none',
} as const;

export type TagIconPosition = (typeof TAG_ICON_POSITION)[keyof typeof TAG_ICON_POSITION];

export type TagProps = {
  label: string;
  icon?: ReactNode;
  iconPosition?: TagIconPosition;
  className?: string;
};

export const Tag = ({
  label,
  icon,
  iconPosition = TAG_ICON_POSITION.none,
  className,
}: TagProps) => {
  const showIconLeft = icon && iconPosition === TAG_ICON_POSITION.left;
  const showIconRight = icon && iconPosition === TAG_ICON_POSITION.right;

  return (
    <View
      className={cn(
        'flex-row items-center rounded-full border border-white/80 bg-white px-3 py-1.5',
        className,
      )}>
      {showIconLeft ? <Box className="mr-1.5">{icon}</Box> : null}
      <Text size="xs" weight="medium" color="foreground" responsive={false}>
        {label}
      </Text>
      {showIconRight ? <Box className="ml-1.5">{icon}</Box> : null}
    </View>
  );
};
