import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import type {
  DoctorReportClinicalRow,
  DoctorReportViewModel,
} from '@/lib/report/doctorReportTypes';

export type DoctorReportClinicalBlockProps = {
  clinicalRows: readonly DoctorReportClinicalRow[];
  medications: DoctorReportViewModel['medications'];
  concerns: string | null;
};

export const DoctorReportClinicalBlock = ({
  clinicalRows,
  medications,
  concerns,
}: DoctorReportClinicalBlockProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="lg">
      <Box gap="sm" className="rounded-xl border border-border bg-card px-4 py-4">
        <Text size="sm" weight="semibold" className="text-black">
          {t('doctor_report_clinical_title')}
        </Text>
        {clinicalRows.map((row) => (
          <Box
            key={row.id}
            direction="row"
            justify="between"
            align="center"
            className="border-b border-border/60 py-2 last:border-b-0">
            <Text size="xs" className="text-black/70">
              {t(row.labelKey)}
            </Text>
            <Text size="xs" weight="medium" className="text-black">
              {row.value}
            </Text>
          </Box>
        ))}
      </Box>

      <Box gap="sm" className="rounded-xl border border-border bg-card px-4 py-4">
        <Text size="sm" weight="semibold" className="text-black">
          {t('doctor_report_medications_title')}
        </Text>
        {medications.length > 0 ? (
          medications.map((med) => (
            <Text key={med.id} size="xs" className="leading-snug text-black">
              {med.dose?.trim()
                ? t('doctor_report_medication_line', {
                    name: med.name,
                    dose: med.dose.trim(),
                  })
                : med.name}
            </Text>
          ))
        ) : (
          <Text size="xs" className="text-black/70">
            {t('doctor_report_medications_empty')}
          </Text>
        )}
      </Box>

      <Box gap="sm" className="rounded-xl border border-border bg-card px-4 py-4">
        <Text size="sm" weight="semibold" className="text-black">
          {t('doctor_report_concerns_title')}
        </Text>
        <Text size="xs" className="leading-relaxed text-black">
          {concerns ?? t('doctor_report_concerns_empty')}
        </Text>
      </Box>
    </Box>
  );
};
