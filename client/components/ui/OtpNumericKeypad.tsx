import { Pressable, StyleSheet, View } from 'react-native';

import { BackspaceIcon } from '@/components/ui/icons/BackspaceIcon';
import { Text } from '@/components/ui/Text';
import { semanticColors } from '@/lib/ui';

const KEYPAD_ROWS = [
  [
    { digit: '1', letters: '' },
    { digit: '2', letters: 'ABC' },
    { digit: '3', letters: 'DEF' },
  ],
  [
    { digit: '4', letters: 'GHI' },
    { digit: '5', letters: 'JKL' },
    { digit: '6', letters: 'MNO' },
  ],
  [
    { digit: '7', letters: 'PQRS' },
    { digit: '8', letters: 'TUV' },
    { digit: '9', letters: 'WXYZ' },
  ],
] as const;

export type OtpNumericKeypadProps = {
  onDigitPress: (digit: string) => void;
  onBackspacePress: () => void;
  disabled?: boolean;
};

export const OtpNumericKeypad = ({
  onDigitPress,
  onBackspacePress,
  disabled = false,
}: OtpNumericKeypadProps) => (
  <View style={styles.container}>
    {KEYPAD_ROWS.map((row) => (
      <View key={row.map((key) => key.digit).join('-')} style={styles.row}>
        {row.map((key) => (
          <Pressable
            key={key.digit}
            accessibilityRole="button"
            disabled={disabled}
            onPress={() => onDigitPress(key.digit)}
            style={({ pressed }) => [
              styles.key,
              pressed && !disabled ? styles.keyPressed : undefined,
              disabled ? styles.keyDisabled : undefined,
            ]}>
            <Text size="2xl" weight="semibold" align="center" responsive={false}>
              {key.digit}
            </Text>
            {key.letters ? (
              <Text size="2xs" color="foreground-muted" align="center" responsive={false}>
                {key.letters}
              </Text>
            ) : null}
          </Pressable>
        ))}
      </View>
    ))}

    <View style={styles.row}>
      <View style={styles.keySpacer} />
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={() => onDigitPress('0')}
        style={({ pressed }) => [
          styles.key,
          pressed && !disabled ? styles.keyPressed : undefined,
          disabled ? styles.keyDisabled : undefined,
        ]}>
        <Text size="2xl" weight="semibold" align="center" responsive={false}>
          0
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={onBackspacePress}
        style={({ pressed }) => [
          styles.key,
          styles.backspaceKey,
          pressed && !disabled ? styles.keyPressed : undefined,
          disabled ? styles.keyDisabled : undefined,
        ]}>
        <BackspaceIcon size={22} color={semanticColors.foreground} />
      </Pressable>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: semanticColors.muted,
    borderRadius: 24,
    padding: 12,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  key: {
    flex: 1,
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: semanticColors.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  keyPressed: {
    opacity: 0.75,
  },
  keyDisabled: {
    opacity: 0.45,
  },
  keySpacer: {
    flex: 1,
  },
  backspaceKey: {
    justifyContent: 'center',
  },
});
