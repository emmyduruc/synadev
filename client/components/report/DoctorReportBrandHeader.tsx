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
    <Box gap="sm">
      <Text size="xs" weight="semibold" className="tracking-widest text-black">
        {t('doctor_report_brand_line')}
      </Text>

      <Box gap="xs" className="pt-1">
        <Text size="xs" weight="semibold" className="text-black">
          {t('doctor_report_clinical_view')}
        </Text>
        <Text size="sm" weight="semibold" className="text-black">
          {patientName}
        </Text>
        {ageYears !== null ? (
          <Text size="2xs" className="text-black/70">
            {t('doctor_report_patient_age', { age: ageYears })}
          </Text>
        ) : null}
        <Text size="2xs" className="text-black/70">
          {t('doctor_report_patient_tracking', {
            days: trackedDays,
            window: windowDays,
          })}
        </Text>
      </Box>
    </Box>
  );
};
