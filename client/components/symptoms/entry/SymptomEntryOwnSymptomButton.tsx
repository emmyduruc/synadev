import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';

export type SymptomEntryOwnSymptomButtonProps = {
  onPress: () => void;
};

export const SymptomEntryOwnSymptomButton = ({
  onPress,
}: SymptomEntryOwnSymptomButtonProps) => {
  const { t } = useTranslate();

  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      className="items-start py-1">
      <Text size="sm" weight="semibold" color="primary">
        {t('symptom_entry_own_symptom_button')}
      </Text>
    </TouchableOpacity>
  );
};
