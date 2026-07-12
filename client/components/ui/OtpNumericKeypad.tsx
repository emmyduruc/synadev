import { Box } from '@/components/ui/Box';
import { BackspaceIcon } from '@/components/ui/icons/BackspaceIcon';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { cn, semanticColors } from '@/lib/ui';

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

const keypadKeyClassName =
  'min-h-[52px] flex-1 items-center justify-center rounded-xl bg-card py-2';

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
  <Box className="gap-2 rounded-3xl bg-muted p-3">
    {KEYPAD_ROWS.map((row) => (
      <Box key={row.map((key) => key.digit).join('-')} direction="row" gap="sm">
        {row.map((key) => (
          <TouchableOpacity
            key={key.digit}
            accessibilityRole="button"
            disabled={disabled}
            onPress={() => onDigitPress(key.digit)}
            className={cn(keypadKeyClassName, disabled && 'opacity-45')}>
            <Text size="2xl" weight="semibold" align="center" responsive={false}>
              {key.digit}
            </Text>
            {key.letters ? (
              <Text size="2xs" color="foreground-muted" align="center" responsive={false}>
                {key.letters}
              </Text>
            ) : null}
          </TouchableOpacity>
        ))}
      </Box>
    ))}

    <Box direction="row" gap="sm">
      <Box flex={1} />
      <TouchableOpacity
        accessibilityRole="button"
        disabled={disabled}
        onPress={() => onDigitPress('0')}
        className={cn(keypadKeyClassName, disabled && 'opacity-45')}>
        <Text size="2xl" weight="semibold" align="center" responsive={false}>
          0
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityRole="button"
        disabled={disabled}
        onPress={onBackspacePress}
        className={cn(keypadKeyClassName, disabled && 'opacity-45')}>
        <BackspaceIcon size={22} color={semanticColors.foreground} />
      </TouchableOpacity>
    </Box>
  </Box>
);
