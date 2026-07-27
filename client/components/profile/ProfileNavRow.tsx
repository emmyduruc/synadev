import { SymbolView, type SymbolViewProps } from 'expo-symbols';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { semanticColors } from '@/lib/ui';

export type ProfileNavRowProps = {
  title: string;
  subtitle?: string;
  icon: SymbolViewProps['name'];
  onPress: () => void;
};

export const ProfileNavRow = ({
  title,
  subtitle,
  icon,
  onPress,
}: ProfileNavRowProps) => (
  <TouchableOpacity accessibilityRole="button" onPress={onPress}>
    <Box
      direction="row"
      align="center"
      gap="md"
      className="rounded-2xl border border-white/60 bg-white/90 p-5">
      <Box
        align="center"
        justify="center"
        className="h-11 w-11 rounded-full bg-lavender-light">
        <SymbolView name={icon} size={20} tintColor={semanticColors.splashBackground} />
      </Box>
      <Box flex={1} gap="xs">
        <Text size="sm" weight="semibold" className="leading-snug">
          {title}
        </Text>
        {subtitle ? (
          <Text size="xs" color="foreground" className="leading-relaxed">
            {subtitle}
          </Text>
        ) : null}
      </Box>
      <SymbolView
        name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
        size={16}
        tintColor={semanticColors.foregroundMuted}
      />
    </Box>
  </TouchableOpacity>
);
