import { useRef } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { FONT_FAMILY } from '@/lib/fonts/constants';
import { semanticColors } from '@/lib/ui';

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
    <View>
      <Pressable
        accessibilityRole="button"
        onPress={() => inputRef.current?.focus()}
        style={styles.slotsRow}>
        {digits.map((digit, index) => {
          const isActive = index === value.length;
          const slotKey = `otp-slot-${index}`;

          return (
            <View key={slotKey} style={styles.slot}>
              <Text
                size="3xl"
                weight="semibold"
                align="center"
                responsive={false}
                className="min-h-10">
                {digit.trim()}
              </Text>
              <View
                style={[
                  styles.underline,
                  isActive ? styles.underlineActive : undefined,
                ]}
              />
            </View>
          );
        })}
      </Pressable>

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
        style={styles.hiddenInput}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  slotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  slot: {
    flex: 1,
    alignItems: 'center',
  },
  underline: {
    marginTop: 8,
    height: 2,
    width: '100%',
    backgroundColor: semanticColors.foregroundMuted,
    borderRadius: 999,
  },
  underlineActive: {
    backgroundColor: semanticColors.foreground,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
    fontFamily: FONT_FAMILY.regular,
  },
});
