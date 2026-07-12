import { useRef } from 'react';
import { TextInput } from 'react-native';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { cn, hiddenOtpInputStyle } from '@/lib/ui';

export const OTP_CODE_LENGTH = 6;

export type OtpCodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
  onComplete?: (value: string) => void;
};

export const OtpCodeInput = ({
  value,
  onChange,
  length = OTP_CODE_LENGTH,
  autoFocus = true,
  onComplete,
}: OtpCodeInputProps) => {
  const inputRef = useRef<TextInput>(null);
  const digits = value.padEnd(length, ' ').slice(0, length).split('');

  const handleChange = (nextValue: string) => {
    const sanitized = nextValue.replace(/\D/g, '').slice(0, length);
    onChange(sanitized);

    if (sanitized.length === length) {
      onComplete?.(sanitized);
    }
  };

  return (
    <Box>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => inputRef.current?.focus()}
        className="flex-row justify-between gap-2">
        {digits.map((digit, index) => {
          const isActive = index === value.length;
          const slotKey = `otp-slot-${index}`;

          return (
            <Box key={slotKey} flex={1} align="center">
              <Text
                size="3xl"
                weight="semibold"
                align="center"
                responsive={false}
                className="min-h-10">
                {digit.trim()}
              </Text>
              <Box
                className={cn(
                  'mt-2 h-0.5 w-full rounded-full',
                  isActive ? 'bg-foreground' : 'bg-muted-foreground',
                )}
              />
            </Box>
          );
        })}
      </TouchableOpacity>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={length}
        autoFocus={autoFocus}
        caretHidden
        showSoftInputOnFocus={false}
        style={hiddenOtpInputStyle}
      />
    </Box>
  );
};
