import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  InteractionManager,
  Platform,
  TextInput as RNTextInput,
  type TextInputProps as RNTextInputProps,
  type TextStyle,
} from 'react-native';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { FONT_FAMILY } from '@/lib/fonts/constants';
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
  /** Re-triggers focus when this value changes (e.g. wizard step id). Requires `autoFocus`. */
  focusKey?: string | number;
};

const resolveBorderColorClass = (hasError: boolean, isFocused: boolean): string => {
  if (hasError) {
    return borderColorClasses.error;
  }

  if (isFocused) {
    return borderColorClasses.primary;
  }

  return borderColorClasses['foreground-muted'];
};

const resolveFooter = (
  errorMessage: string | undefined,
  helperText: string | undefined,
): ReactNode => {
  if (errorMessage) {
    return (
      <Text size="xs" color="error" className="mt-1.5">
        {errorMessage}
      </Text>
    );
  }

  if (helperText) {
    return (
      <Text size="xs" color="foreground-muted" className="mt-1.5">
        {helperText}
      </Text>
    );
  }

  return null;
};

// Android includes extra font padding that clips glyphs inside fixed-height rows.
const androidSingleLineStyle: TextStyle = {
  includeFontPadding: false,
  textAlignVertical: 'center',
  paddingVertical: 0,
};

const buildInputStyle = (multiline: boolean): TextStyle => {
  if (Platform.OS !== 'android') {
    return { fontFamily: FONT_FAMILY.regular };
  }

  if (multiline) {
    return {
      fontFamily: FONT_FAMILY.regular,
      includeFontPadding: false,
    };
  }

  return {
    fontFamily: FONT_FAMILY.regular,
    ...androidSingleLineStyle,
  };
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
  autoFocus = false,
  focusKey,
  multiline = false,
  onFocus,
  onBlur,
  ...props
}: TextInputProps) => {
  const inputRef = useRef<RNTextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(errorMessage);
  const borderColorClass = resolveBorderColorClass(hasError, isFocused);
  const footer = resolveFooter(errorMessage, helperText);
  const inputStyle = buildInputStyle(multiline);

  useEffect(() => {
    if (!autoFocus || disabled) {
      return undefined;
    }

    const task = InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    });

    return () => task.cancel();
  }, [autoFocus, disabled, focusKey]);

  const handleFocus: RNTextInputProps['onFocus'] = (event) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur: RNTextInputProps['onBlur'] = (event) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  const fieldClassName = cn(
    'w-full border bg-white/90 font-sans text-foreground',
    radiusClasses.xl,
    inputPaddingClasses[size],
    borderColorClass,
    disabled && 'opacity-50',
    multiline ? 'min-h-24 py-3' : undefined,
    inputClassName,
    className,
  );

  return (
    <Box className={cn('w-full', containerClassName)}>
      {label ? (
        <Text size="sm" weight="medium" color="foreground" className="mb-1.5">
          {label}
        </Text>
      ) : null}

      {multiline ? (
        <RNTextInput
          ref={inputRef}
          className={fieldClassName}
          style={inputStyle}
          editable={!disabled}
          placeholderTextColor={semanticColors.placeholder}
          autoFocus={autoFocus}
          multiline
          textAlignVertical="top"
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      ) : (
        <Box
          direction="row"
          align="center"
          className={cn(
            'w-full border bg-white/90 overflow-hidden',
            radiusClasses.xl,
            inputSizeClasses[size],
            borderColorClass,
            disabled && 'opacity-50',
          )}>
          {leftIcon ? <Box paddingX="sm">{leftIcon}</Box> : null}

          <RNTextInput
            ref={inputRef}
            className={cn(
              'flex-1 h-full font-sans text-foreground',
              inputPaddingClasses[size],
              leftIcon ? 'pl-0' : undefined,
              rightIcon ? 'pr-0' : undefined,
              inputClassName,
              className,
            )}
            style={inputStyle}
            editable={!disabled}
            placeholderTextColor={semanticColors.placeholder}
            autoFocus={autoFocus}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />

          {rightIcon ? <Box paddingX="sm">{rightIcon}</Box> : null}
        </Box>
      )}

      {footer}
    </Box>
  );
};
