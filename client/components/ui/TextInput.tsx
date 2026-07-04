import type { ReactNode } from 'react';
import { useState } from 'react';
import {
  TextInput as RNTextInput,
  type TextInputProps as RNTextInputProps,
} from 'react-native';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import {
  borderColorClasses,
  cn,
  inputPaddingClasses,
  inputSizeClasses,
  radiusClasses,
  semanticColors,
} from '@/lib/ui';
import type { InputSize } from '@/lib/ui';

export type TextInputProps = Omit<RNTextInputProps, 'editable'> & {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  size?: InputSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  disabled?: boolean;
  containerClassName?: string;
  inputClassName?: string;
};

export const TextInput = ({
  label,
  helperText,
  errorMessage,
  size = 'md',
  leftIcon,
  rightIcon,
  disabled = false,
  containerClassName,
  inputClassName,
  className,
  onFocus,
  onBlur,
  ...props
}: TextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(errorMessage);

  const handleFocus: RNTextInputProps['onFocus'] = (event) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur: RNTextInputProps['onBlur'] = (event) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  const resolveBorderColorClass = (): string => {
    if (hasError) {
      return borderColorClasses.error;
    }

    if (isFocused) {
      return borderColorClasses.primary;
    }

    return borderColorClasses['foreground-muted'];
  };

  let footer: ReactNode = null;

  if (hasError) {
    footer = (
      <Text size="xs" color="error" className="mt-1.5">
        {errorMessage}
      </Text>
    );
  } else if (helperText) {
    footer = (
      <Text size="xs" color="foreground-muted" className="mt-1.5">
        {helperText}
      </Text>
    );
  }

  return (
    <Box className={cn('w-full', containerClassName)}>
      {label ? (
        <Text size="sm" weight="medium" color="foreground" className="mb-1.5">
          {label}
        </Text>
      ) : null}

      <Box
        direction="row"
        align="center"
        className={cn(
          'w-full border bg-white/90',
          radiusClasses.xl,
          inputSizeClasses[size],
          resolveBorderColorClass(),
          disabled && 'opacity-50',
        )}>
        {leftIcon ? <Box paddingX="sm">{leftIcon}</Box> : null}

        <RNTextInput
          className={cn(
            'flex-1 text-foreground',
            inputPaddingClasses[size],
            leftIcon ? 'pl-0' : undefined,
            rightIcon ? 'pr-0' : undefined,
            inputClassName,
            className,
          )}
          editable={!disabled}
          placeholderTextColor={semanticColors.placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {rightIcon ? <Box paddingX="sm">{rightIcon}</Box> : null}
      </Box>

      {footer}
    </Box>
  );
};
