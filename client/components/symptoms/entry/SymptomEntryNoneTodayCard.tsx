import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { cn } from '@/lib/ui';

export type SymptomEntryNoneTodayCardProps = {
  isSelected: boolean;
  onPress: () => void;
};

export const SymptomEntryNoneTodayCard = ({
  isSelected,
  onPress,
}: SymptomEntryNoneTodayCardProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="sm" align="center">
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        onPress={onPress}
        className={cn(
          'w-full items-center rounded-2xl px-4 py-4',
          isSelected ? 'bg-primary-100' : 'bg-lavender-light',
        )}>
        <Text size="sm" weight="semibold">
          {t('symptom_entry_none_today_title')}
        </Text>
      </TouchableOpacity>
      <Text size="xs" color="foreground-muted" className="text-center leading-relaxed px-2">
        {t('symptom_entry_none_today_caption')}
      </Text>
    </Box>
  );
};
