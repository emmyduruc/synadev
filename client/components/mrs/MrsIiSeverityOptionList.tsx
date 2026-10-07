import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { MRS_II_SEVERITY_LABEL_KEYS } from '@/lib/mrs/mrsIiCatalog';
import {
  MRS_II_SEVERITY_VALUES,
  type MrsIiSeverityValue,
} from '@/lib/mrs/mrsIiTypes';
import { cn } from '@/lib/ui';

export type MrsIiSeverityOptionListProps = {
  value: MrsIiSeverityValue | null;
  disabled?: boolean;
  onSelect: (value: MrsIiSeverityValue) => void;
};

export const MrsIiSeverityOptionList = ({
  value,
  disabled = false,
  onSelect,
}: MrsIiSeverityOptionListProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="sm">
      {MRS_II_SEVERITY_VALUES.map((severityValue) => {
        const isSelected = value === severityValue;

        return (
          <TouchableOpacity
            key={severityValue}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected, disabled }}
            disabled={disabled}
            onPress={() => onSelect(severityValue)}
            className={cn(
              'w-full rounded-2xl border border-border bg-card px-4 py-4',
              isSelected && 'border-primary-400 bg-primary-50',
              disabled && 'opacity-60',
            )}>
            <Text size="base" weight="normal" family="sans" className="leading-snug">
              {t(MRS_II_SEVERITY_LABEL_KEYS[severityValue])}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Box>
  );
};
