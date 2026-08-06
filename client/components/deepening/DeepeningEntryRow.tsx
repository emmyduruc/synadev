import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';

export type DeepeningEntryRowProps = {
  label: string;
  isCompleted: boolean;
  summary?: string;
  onPress: () => void;
};

export const DeepeningEntryRow = ({
  label,
  isCompleted,
  summary,
  onPress,
}: DeepeningEntryRowProps) => {
  const { t } = useTranslate();

  return (
    <Box direction="row" align="center" justify="between" gap="md">
      <Box flex={1} gap="xs">
        <Text size="sm" weight="medium" className="leading-snug">
          {label}
        </Text>
        {isCompleted && summary ? (
          <Text size="xs" color="foreground-muted" numberOfLines={1}>
            {summary}
          </Text>
        ) : null}
      </Box>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={onPress}
        className="rounded-full bg-sage-mist-light px-3 py-2">
        <Text size="xs" weight="semibold" color="primary">
          {isCompleted ? t('deepening_edit_button') : t('deepening_add_button')}
        </Text>
      </TouchableOpacity>
    </Box>
  );
};
