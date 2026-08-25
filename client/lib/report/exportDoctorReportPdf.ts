import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { buildDoctorReportHtml } from '@/lib/report/buildDoctorReportHtml';
import type { DoctorReportViewModel } from '@/lib/report/doctorReportTypes';

export type ExportDoctorReportPdfInput = {
  report: DoctorReportViewModel;
  t: (key: string, options?: Record<string, unknown>) => string;
};

export const exportDoctorReportPdf = async ({
  report,
  t,
}: ExportDoctorReportPdfInput): Promise<void> => {
  const html = buildDoctorReportHtml(report, {
    title: t('doctor_report_pdf_title'),
    subtitle: t('doctor_report_pdf_subtitle'),
    generatedLabel: t('doctor_report_pdf_generated', {
      date: report.generatedAtIso.slice(0, 10),
    }),
    patientLabel: t('doctor_report_pdf_patient'),
    ageLabel: t('doctor_report_pdf_age'),
    windowLabel: t('doctor_report_pdf_window', {
      from: report.windowStartDateKey,
      to: report.windowEndDateKey,
      days: report.windowDays,
    }),
    scoresTitle: t('doctor_report_scores_title'),
    clinicalTitle: t('doctor_report_clinical_title'),
    medicationsTitle: t('doctor_report_medications_title'),
    concernsTitle: t('doctor_report_concerns_title'),
    concernsEmpty: t('doctor_report_concerns_empty'),
    medicationsEmpty: t('doctor_report_medications_empty'),
    symptomGridTitle: t('doctor_report_symptom_grid_title'),
    disclaimer: t('doctor_report_disclaimer'),
    translate: (key, options) => t(key, options),
  });

  const file = await Print.printToFileAsync({ html });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
      dialogTitle: t('doctor_report_pdf_share_title'),
    });
  }
};
