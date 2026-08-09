import type { ReactNode } from 'react';
import { ActivityIndicator, type TouchableOpacityProps } from 'react-native';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import {
  buttonSizeClasses,
  buttonTextClasses,
  buttonVariantClasses,
  cn,
  isLightButtonVariant,
  radiusClasses,
  semanticColors,
} from '@/lib/ui';
import type { ButtonSize, ButtonVariant, FontSize } from '@/lib/ui';

export type ButtonProps = Omit<TouchableOpacityProps, 'children'> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  textClassName?: string;
};

const buttonLabelSize: Record<ButtonSize, FontSize> = {
  sm: 'sm',
  md: 'base',
  lg: 'lg',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  fullWidth = false,
  disabled,
  className,
  textClassName,
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      disabled={isDisabled}
      className={cn(
        'flex-row items-center justify-center',
        radiusClasses.full,
        buttonVariantClasses[variant],
        buttonSizeClasses[size],
        fullWidth && 'w-full',
        isDisabled && 'opacity-50',
        className,
      )}
      {...props}>
      {loading ? (
        <ActivityIndicator
          color={
            isLightButtonVariant(variant)
              ? semanticColors.foreground
              : semanticColors.iconOnPrimary
          }
        />
      ) : (
        <>
          {leftIcon ? <Box className="mr-2">{leftIcon}</Box> : null}
          <Text
            size={buttonLabelSize[size]}
            weight="semibold"
            align="center"
            responsive={false}
            numberOfLines={1}
            className={cn(buttonTextClasses[variant], textClassName)}>
            {children}
          </Text>
          {rightIcon ? <Box className="ml-2">{rightIcon}</Box> : null}
        </>
      )}
    </TouchableOpacity>
  );
};
