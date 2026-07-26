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

export type MrsSeverityChipsProps = {
  value: MrsIiSeverityValue | null;
  onChange: (value: MrsIiSeverityValue) => void;
};

export const MrsSeverityChips = ({ value, onChange }: MrsSeverityChipsProps) => {
  const { t } = useTranslate();

  return (
    <Box direction="row" className="flex-wrap gap-2">
      {MRS_II_SEVERITY_VALUES.map((severityValue) => {
        const isSelected = value === severityValue;

        return (
          <TouchableOpacity
            key={severityValue}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onChange(severityValue)}
            className={cn(
              'rounded-full border-2 px-3 py-2',
              isSelected
                ? 'border-primary-500 bg-primary-500'
                : 'border-white bg-card shadow-sm',
            )}>
            <Text
              size="2xs"
              weight={isSelected ? 'semibold' : 'medium'}
              color={isSelected ? 'white' : 'foreground'}
              responsive={false}>
              {t(MRS_II_SEVERITY_LABEL_KEYS[severityValue])}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Box>
  );
};
