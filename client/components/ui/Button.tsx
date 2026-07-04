import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, type PressableProps } from 'react-native';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import {
  buttonSizeClasses,
  buttonTextClasses,
  buttonTextSizeClasses,
  buttonVariantClasses,
  cn,
  isLightButtonVariant,
  radiusClasses,
  semanticColors,
} from '@/lib/ui';
import type { ButtonSize, ButtonVariant } from '@/lib/ui';

export type ButtonProps = Omit<PressableProps, 'children'> & {
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
    <Pressable
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
            weight="semibold"
            className={cn(
              buttonTextClasses[variant],
              buttonTextSizeClasses[size],
              textClassName,
            )}>
            {children}
          </Text>
          {rightIcon ? <Box className="ml-2">{rightIcon}</Box> : null}
        </>
      )}
    </Pressable>
  );
};
