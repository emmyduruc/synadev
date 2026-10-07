import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { cn } from '@/lib/ui';

export type ClinicalTopicOption = {
  id: string;
  labelKey: string;
};

export type ClinicalTopicButtonListProps = {
  options: readonly ClinicalTopicOption[];
  selectedIds: readonly string[];
  onToggle: (id: string) => void;
};

export const ClinicalTopicButtonList = ({
  options,
  selectedIds,
  onToggle,
}: ClinicalTopicButtonListProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="sm">
      {options.map((option) => {
        const isSelected = selectedIds.includes(option.id);

        return (
          <TouchableOpacity
            key={option.id}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onToggle(option.id)}
            className={cn(
              'w-full items-center rounded-2xl border border-border bg-card px-4 py-4',
              isSelected && 'border-primary-400 bg-primary-50',
            )}>
            <Text size="sm" weight="normal" family="sans" align="center">
              {t(option.labelKey)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Box>
  );
};
