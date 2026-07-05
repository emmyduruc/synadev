import { SymbolView } from 'expo-symbols';

import { Box } from '@/components/ui/Box';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { PROFILE_COMPLETION_PERCENT } from '@/lib/profile/constants';
import { semanticColors } from '@/lib/ui';

export type ProfileCompletionCardProps = {
  percent?: number;
  onPress?: () => void;
};

export const ProfileCompletionCard = ({
  percent = PROFILE_COMPLETION_PERCENT,
  onPress,
}: ProfileCompletionCardProps) => {
  const { t } = useTranslate();

  return (
    <TouchableOpacity accessibilityRole="button" onPress={onPress}>
      <Box
        direction="row"
        align="center"
        gap="md"
        className="rounded-2xl h-20 border border-white/60 bg-white/90 p-5">
        <CircularProgress percent={percent} size={50} />
        <Box flex={1} gap="xs">
          <Text size="sm" weight="semibold" className="leading-snug">
            {t('profile_completion_title', { percent })}
          </Text>
          <Box direction="row" align="center" gap="xs">
            <Text size="xs" color="foreground-muted" className="flex-1 leading-relaxed">
              {t('profile_completion_hint')}
            </Text>
            <SymbolView
              name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
              size={14}
              tintColor={semanticColors.foregroundMuted}
            />
          </Box>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};
