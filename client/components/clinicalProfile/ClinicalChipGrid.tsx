import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { cn } from '@/lib/ui';

export type ClinicalChipOption = {
  id: string;
  labelKey: string;
};

export type ClinicalChipGridProps = {
  options: readonly ClinicalChipOption[];
  selectedIds: readonly string[];
  onToggle: (id: string) => void;
};

export const ClinicalChipGrid = ({
  options,
  selectedIds,
  onToggle,
}: ClinicalChipGridProps) => {
  const { t } = useTranslate();

  return (
    <Box direction="row" className="flex-wrap gap-2.5">
      {options.map((option) => {
        const isSelected = selectedIds.includes(option.id);

        return (
          <TouchableOpacity
            key={option.id}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onToggle(option.id)}
            className={cn(
              'w-[48%] items-center rounded-full border border-border bg-card px-3 py-3',
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
