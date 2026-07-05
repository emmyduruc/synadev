import type { ReactNode } from 'react';
import { View, type StyleProp, type TouchableOpacityProps, type ViewStyle } from 'react-native';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { cn } from '@/lib/ui';

export const TAG_ICON_POSITION = {
  left: 'left',
  right: 'right',
  none: 'none',
} as const;

export type TagIconPosition = (typeof TAG_ICON_POSITION)[keyof typeof TAG_ICON_POSITION];

export type TagProps = Omit<TouchableOpacityProps, 'children'> & {
  label: string;
  icon?: ReactNode;
  iconPosition?: TagIconPosition;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export const Tag = ({
  label,
  icon,
  iconPosition = TAG_ICON_POSITION.none,
  className,
  style,
  onPress,
  disabled,
  ...props
}: TagProps) => {
  const showIconLeft = icon && iconPosition === TAG_ICON_POSITION.left;
  const showIconRight = icon && iconPosition === TAG_ICON_POSITION.right;
  const isInteractive = Boolean(onPress);

  const content = (
    <Box
      direction="row"
      align="center"
      pointerEvents="none"
      className={cn(
        'rounded-full border border-white/80 bg-white px-3 py-1.5',
        className,
      )}>
      {showIconLeft ? <Box className="mr-1.5">{icon}</Box> : null}
      <Text size="xs" weight="medium" color="foreground" responsive={false}>
        {label}
      </Text>
      {showIconRight ? <Box className="ml-1.5">{icon}</Box> : null}
    </Box>
  );

  if (!isInteractive) {
    return <View style={style}>{content}</View>;
  }

  return (
    <TouchableOpacity
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={style}
      {...props}>
      {content}
    </TouchableOpacity>
  );
};
