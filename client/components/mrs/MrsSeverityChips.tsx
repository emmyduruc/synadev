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

/**
 * Official MRS-II intensity options (ZEG Berlin / menopause-rating-scale.info):
 * 0 keine, 1 leicht, 2 mittel, 3 stark, 4 sehr stark
 *
 * Layout mirrors PAM-13 style (full-width single-select rows) while keeping
 * the MRS-II 5-point severity scale, not PAM-13 agree/disagree labels.
 */
export const MrsSeverityChips = ({ value, onChange }: MrsSeverityChipsProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="sm" className="w-full">
      {MRS_II_SEVERITY_VALUES.map((severityValue) => {
        const isSelected = value === severityValue;

        return (
          <TouchableOpacity
            key={severityValue}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onChange(severityValue)}
            className={cn(
              'w-full items-center justify-center rounded-full px-4 py-3.5',
              isSelected
                ? 'bg-primary-600'
                : 'bg-muted',
            )}>
            <Text
              size="sm"
              weight={isSelected ? 'semibold' : 'medium'}
              color={isSelected ? 'white' : 'foreground'}
              align="center"
              responsive={false}>
              {t(MRS_II_SEVERITY_LABEL_KEYS[severityValue])}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Box>
  );
};
