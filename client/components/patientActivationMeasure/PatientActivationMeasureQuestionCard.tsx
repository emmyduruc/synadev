import { PatientActivationMeasureResponseOptions } from '@/components/patientActivationMeasure/PatientActivationMeasureResponseOptions';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import type { PatientActivationMeasureItem } from '@/lib/patientActivationMeasure/patientActivationMeasureCatalog';
import { PATIENT_ACTIVATION_MEASURE_ITEM_COUNT } from '@/lib/patientActivationMeasure/patientActivationMeasureCatalog';
import type { PatientActivationMeasureResponseValue } from '@/lib/patientActivationMeasure/patientActivationMeasureTypes';

export type PatientActivationMeasureQuestionCardProps = {
  item: PatientActivationMeasureItem;
  value: PatientActivationMeasureResponseValue | null;
  onChange: (value: PatientActivationMeasureResponseValue) => void;
};

export const PatientActivationMeasureQuestionCard = ({
  item,
  value,
  onChange,
}: PatientActivationMeasureQuestionCardProps) => {
  const { t } = useTranslate();

  return (
    <Box
      gap="md"
      className="rounded-3xl border border-white bg-card p-5 shadow-sm">
      <Text
        size="2xs"
        weight="semibold"
        color="foreground"
        className="uppercase tracking-wide">
        {t('patient_activation_measure_question_progress', {
          current: item.index,
          total: PATIENT_ACTIVATION_MEASURE_ITEM_COUNT,
        })}
      </Text>
      <Text size="lg" weight="semibold" className="leading-snug">
        {t(item.titleKey)}
      </Text>
      <PatientActivationMeasureResponseOptions value={value} onChange={onChange} />
    </Box>
  );
};
