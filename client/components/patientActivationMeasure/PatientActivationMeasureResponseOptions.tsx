import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { PATIENT_ACTIVATION_MEASURE_RESPONSE_LABEL_KEYS } from '@/lib/patientActivationMeasure/patientActivationMeasureCatalog';
import {
  PATIENT_ACTIVATION_MEASURE_RESPONSE_VALUES,
  type PatientActivationMeasureResponseValue,
} from '@/lib/patientActivationMeasure/patientActivationMeasureTypes';
import { cn } from '@/lib/ui';

export type PatientActivationMeasureResponseOptionsProps = {
  value: PatientActivationMeasureResponseValue | null;
  onChange: (value: PatientActivationMeasureResponseValue) => void;
};

/**
 * Patient Activation Measure 4-point Likert (values 1-4).
 * Full-width rows match the product mockups.
 */
export const PatientActivationMeasureResponseOptions = ({
  value,
  onChange,
}: PatientActivationMeasureResponseOptionsProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="sm" className="w-full">
      {PATIENT_ACTIVATION_MEASURE_RESPONSE_VALUES.map((responseValue) => {
        const isSelected = value === responseValue;

        return (
          <TouchableOpacity
            key={responseValue}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onChange(responseValue)}
            className={cn(
              'w-full items-center justify-center rounded-full px-4 py-3.5',
              isSelected ? 'bg-primary-600' : 'bg-muted',
            )}>
            <Text
              size="sm"
              weight={isSelected ? 'semibold' : 'medium'}
              color={isSelected ? 'white' : 'foreground'}
              align="center"
              responsive={false}>
              {t(PATIENT_ACTIVATION_MEASURE_RESPONSE_LABEL_KEYS[responseValue])}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Box>
  );
};
