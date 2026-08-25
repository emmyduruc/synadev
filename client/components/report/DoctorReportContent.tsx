import { useCallback, useState, type ReactElement } from 'react';

import { DoctorReportBrandHeader } from '@/components/report/DoctorReportBrandHeader';
import { DoctorReportClinicalBlock } from '@/components/report/DoctorReportClinicalBlock';
import { DoctorReportHero } from '@/components/report/DoctorReportHero';
import { DoctorReportScoresBand } from '@/components/report/DoctorReportScoresBand';
import { DoctorReportSectionCard } from '@/components/report/DoctorReportSectionCard';
import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import type { DoctorReportViewModel } from '@/lib/report/doctorReportTypes';
import { exportDoctorReportPdf } from '@/lib/report/exportDoctorReportPdf';
import { REPORT_MIN_TRACKED_DAYS } from '@/lib/report/reportConstants';

export type DoctorReportContentProps = {
  report: DoctorReportViewModel;
};

export const DoctorReportContent = ({
  report,
}: DoctorReportContentProps): ReactElement => {
  const { t } = useTranslate();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(async () => {
    if (isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      await exportDoctorReportPdf({ report, t });
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, report, t]);

  return (
    <Box gap="xl" className="pb-8">
      <DoctorReportBrandHeader
        patientName={report.patientName}
        ageYears={report.ageYears}
        windowDays={report.windowDays}
        trackedDays={report.trackedDays}
      />

      <DoctorReportHero
        summaryKey={report.summaryKey}
        summaryParams={report.summaryParams}
      />

      <Button
        variant="primary"
        disabled={isExporting}
        onPress={() => {
          void handleExport();
        }}>
        {isExporting ? t('doctor_report_exporting') : t('doctor_report_export_pdf')}
      </Button>

      <DoctorReportScoresBand scores={report.scores} />

      {report.isEmpty ? (
        <Box className="rounded-xl bg-card px-4 py-5">
          <Text size="sm" className="leading-relaxed text-black">
            {t('doctor_report_empty_body', {
              minDays: REPORT_MIN_TRACKED_DAYS,
              trackedDays: report.trackedDays,
            })}
          </Text>
        </Box>
      ) : (
        report.sections.map((section) => (
          <DoctorReportSectionCard
            key={section.id}
            section={section}
            heatmap={report.heatmap}
          />
        ))
      )}

      <DoctorReportClinicalBlock
        clinicalRows={report.clinicalRows}
        medications={report.medications}
        concerns={report.concerns}
      />

      <Box className="border-t border-border pt-4">
        <Text size="2xs" className="leading-relaxed text-black/70">
          {t('doctor_report_disclaimer')}
        </Text>
      </Box>
    </Box>
  );
};
