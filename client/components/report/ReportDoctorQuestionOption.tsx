import { View } from 'react-native';

import { Box } from '@/components/ui/Box';
import { CheckIcon } from '@/components/ui/icons/CheckIcon';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { semanticColors } from '@/lib/ui';

export type ReportDoctorQuestionOptionProps = {
  id: string;
  labelKey: string;
  isSelected: boolean;
  onToggle: (id: string) => void;
};

export const ReportDoctorQuestionOption = ({
  id,
  labelKey,
  isSelected,
  onToggle,
}: ReportDoctorQuestionOptionProps) => {
  const { t } = useTranslate();

  return (
    <TouchableOpacity
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isSelected }}
      onPress={() => onToggle(id)}
      className="rounded-2xl border px-3.5 py-3.5"
      style={{
        backgroundColor: isSelected ? semanticColors.ink2 : semanticColors.card,
        borderColor: isSelected ? semanticColors.ink2 : semanticColors.border,
      }}>
      <Box direction="row" align="center" gap="md">
        <View
          className="h-6 w-6 items-center justify-center rounded-md"
          style={{
            backgroundColor: isSelected ? semanticColors.card : 'transparent',
            borderWidth: isSelected ? 0 : 1.5,
            borderColor: semanticColors.border,
          }}>
          {isSelected ? (
            <CheckIcon size={14} color={semanticColors.ink2} />
          ) : null}
        </View>

        <Text
          size="sm"
          weight="medium"
          className="min-w-0 flex-1 leading-relaxed"
          style={{ color: isSelected ? semanticColors.card : semanticColors.ink2 }}>
          {t(labelKey)}
        </Text>
      </Box>
    </TouchableOpacity>
  );
};
