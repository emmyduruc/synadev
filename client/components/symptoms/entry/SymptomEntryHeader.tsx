import { Box } from '@/components/ui/Box';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { semanticColors } from '@/lib/ui';

export type SymptomEntryHeaderProps = {
  onBack: () => void;
};

export const SymptomEntryHeader = ({ onBack }: SymptomEntryHeaderProps) => {
  const { t } = useTranslate();

  return (
    <Box direction="row" align="center" className="px-2 py-2">
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={t('symptom_entry_back_label')}
        hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        onPress={onBack}
        className="h-10 w-10 items-center justify-center">
        <ChevronLeftIcon size={22} color={semanticColors.foreground} />
      </TouchableOpacity>
      <Box flex={1} align="center" className="pr-10">
        <Text size="lg" weight="bold">
          {t('symptom_entry_screen_title')}
        </Text>
      </Box>
    </Box>
  );
};
