import type {
  MrsIiAssessmentSubmission,
  Pam13AssessmentSubmission,
} from '@syna/shared-types';
import type { PatternsComputation } from '@syna/shared-utils';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { buildPatternsReportHtml } from '@/lib/patterns/buildPatternsReportHtml';

export type ExportPatternsPdfInput = {
  computation: PatternsComputation;
  mrsLatest: MrsIiAssessmentSubmission | null;
  pamLatest: Pam13AssessmentSubmission | null;
  t: (key: string, options?: Record<string, unknown>) => string;
};

export const exportPatternsPdf = async ({
  computation,
  mrsLatest,
  pamLatest,
  t,
}: ExportPatternsPdfInput): Promise<void> => {
  const html = buildPatternsReportHtml(computation, mrsLatest, pamLatest, {
    title: t('patterns_pdf_title'),
    dateRange: t('patterns_pdf_date_range', {
      from: computation.windowStartDateKey,
      to: computation.windowEndDateKey,
    }),
    disclaimer: t('patterns_disclaimer'),
    mrsLabel: t('patterns_clinical_mrs_label'),
    pamLabel: t('patterns_clinical_pam_label'),
    axesTitle: t('patterns_axes_section_title'),
    contextsTitle: t('patterns_contexts_section_title'),
    heatmapTitle: t('patterns_heatmap_title'),
    statusRecognized: t('patterns_status_recognized'),
    statusEmerging: t('patterns_status_emerging'),
    statusNeedsData: t('patterns_status_needs_more_data'),
    statusLocked: t('patterns_status_locked'),
    emptyMrs: t('patterns_clinical_mrs_empty'),
    emptyPam: t('patterns_clinical_pam_empty'),
    translate: (key) => t(key),
  });

  const file = await Print.printToFileAsync({ html });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
      dialogTitle: t('patterns_pdf_share_title'),
    });
  }
};
