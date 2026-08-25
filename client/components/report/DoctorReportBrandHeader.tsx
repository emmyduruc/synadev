import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';

export type DoctorReportBrandHeaderProps = {
  patientName: string;
  ageYears: number | null;
  windowDays: number;
  trackedDays: number;
};

export const DoctorReportBrandHeader = ({
  patientName,
  ageYears,
  windowDays,
  trackedDays,
}: DoctorReportBrandHeaderProps) => {
  const { t } = useTranslate();

  return (
    <Box direction="row" align="start" justify="between" gap="md">
      <Text size="xs" weight="semibold" className="tracking-widest text-black">
        {t('doctor_report_brand_line')}
      </Text>
      <Box align="end" gap="xs">
        <Text size="xs" weight="semibold" className="text-black">
          {t('doctor_report_clinical_view')}
        </Text>
        <Text size="2xs" className="text-black/70">
          {t('doctor_report_patient_meta', {
            name: patientName,
            age: ageYears ?? '-',
            days: trackedDays,
            window: windowDays,
          })}
        </Text>
      </Box>
    </Box>
  );
};
