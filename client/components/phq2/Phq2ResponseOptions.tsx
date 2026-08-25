import type { Phq2SeverityValue } from '@syna/shared-types';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import {
  PHQ2_RESPONSE_LABEL_KEYS,
  PHQ2_RESPONSE_VALUES,
} from '@/lib/phq2/phq2Catalog';

export type Phq2ResponseOptionsProps = {
  value: Phq2SeverityValue | null;
  onChange: (value: Phq2SeverityValue) => void;
};

export const Phq2ResponseOptions = ({
  value,
  onChange,
}: Phq2ResponseOptionsProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="sm">
      {PHQ2_RESPONSE_VALUES.map((option) => {
        const isSelected = value === option;

        return (
          <TouchableOpacity
            key={option}
            accessibilityRole="button"
            onPress={() => onChange(option)}
            className={
              isSelected
                ? 'rounded-2xl border border-primary bg-primary/10 px-4 py-3'
                : 'rounded-2xl border border-border bg-white/90 px-4 py-3'
            }>
            <Text size="sm" weight={isSelected ? 'semibold' : 'medium'}>
              {t(PHQ2_RESPONSE_LABEL_KEYS[option])}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Box>
  );
};
