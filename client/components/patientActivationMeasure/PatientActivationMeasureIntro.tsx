import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';

export const PatientActivationMeasureIntro = () => {
  const { t } = useTranslate();

  return (
    <Box gap="lg" paddingX="lg" paddingY="md">
      <Box gap="sm">
        <Text size="2xl" weight="bold" className="leading-tight">
          {t('patient_activation_measure_intro_title')}
        </Text>
        <Text size="sm" color="foreground" className="leading-relaxed">
          {t('patient_activation_measure_intro_meta')}
        </Text>
      </Box>

      <Box gap="sm" className="rounded-3xl border border-lavender bg-lavender-light p-5">
        <Text size="base" weight="semibold">
          {t('patient_activation_measure_intro_acronym_heading')}
        </Text>
        <Text size="sm" color="foreground" className="leading-relaxed">
          {t('patient_activation_measure_intro_acronym_body')}
        </Text>
      </Box>

      <Box gap="sm">
        <Text size="base" weight="semibold">
          {t('patient_activation_measure_intro_why_heading')}
        </Text>
        <Text size="sm" color="foreground" className="leading-relaxed">
          {t('patient_activation_measure_intro_why_body')}
        </Text>
      </Box>

      <Text size="xs" color="foreground" className="leading-relaxed">
        {t('patient_activation_measure_intro_disclaimer')}
      </Text>
    </Box>
  );
};
