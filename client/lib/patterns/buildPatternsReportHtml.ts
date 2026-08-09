import type {
  MrsIiAssessmentSubmission,
  Pam13AssessmentSubmission,
} from '@syna/shared-types';
import type { PatternsComputation } from '@syna/shared-utils';
import { PATTERN_STATUS } from '@syna/shared-utils';

export type PatternsReportCopy = {
  title: string;
  dateRange: string;
  disclaimer: string;
  mrsLabel: string;
  pamLabel: string;
  axesTitle: string;
  contextsTitle: string;
  heatmapTitle: string;
  statusRecognized: string;
  statusEmerging: string;
  statusNeedsData: string;
  statusLocked: string;
  emptyMrs: string;
  emptyPam: string;
  translate: (key: string) => string;
};

export const buildPatternsReportHtml = (
  computation: PatternsComputation,
  mrsLatest: MrsIiAssessmentSubmission | null,
  pamLatest: Pam13AssessmentSubmission | null,
  copy: PatternsReportCopy,
): string => {
  const statusLabel = (status: string) => {
    if (status === PATTERN_STATUS.recognized) {
      return copy.statusRecognized;
    }

    if (status === PATTERN_STATUS.emerging) {
      return copy.statusEmerging;
    }

    if (status === PATTERN_STATUS.locked) {
      return copy.statusLocked;
    }

    return copy.statusNeedsData;
  };

  const axesHtml = computation.axes
    .map(
      (axis) => `
      <div class="card">
        <div class="chip">${statusLabel(axis.status)}</div>
        <h3>${copy.translate(axis.titleKey)}</h3>
        <p>${copy.translate(axis.summaryKey)}</p>
      </div>`,
    )
    .join('');

  const contextsHtml = computation.contexts
    .map(
      (context) => `
      <div class="card">
        <div class="chip">${statusLabel(context.status)}</div>
        <h3>${copy.translate(context.titleKey)}</h3>
        <p>${copy.translate(context.summaryKey)}</p>
      </div>`,
    )
    .join('');

  const mrsBlock = mrsLatest
    ? `<p><strong>${copy.mrsLabel}:</strong> ${mrsLatest.total}/44
      (S ${mrsLatest.subscores.somatic}, P ${mrsLatest.subscores.psychological}, U ${mrsLatest.subscores.urogenital})</p>`
    : `<p><strong>${copy.mrsLabel}:</strong> ${copy.emptyMrs}</p>`;

  const pamBlock =
    pamLatest?.scaledScore !== null && pamLatest?.scaledScore !== undefined
      ? `<p><strong>${copy.pamLabel}:</strong> ${Math.round(pamLatest.scaledScore)}</p>`
      : `<p><strong>${copy.pamLabel}:</strong> ${copy.emptyPam}</p>`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: -apple-system, Helvetica, Arial, sans-serif; color: #3b2a32; margin: 0; padding: 28px; background: #fff8f6; }
    .hero { background: linear-gradient(135deg, #f3e8ff, #ffe4e1 55%, #fff7ed); border-radius: 24px; padding: 24px; margin-bottom: 20px; }
    h1 { margin: 0 0 6px; font-size: 28px; letter-spacing: 0.02em; }
    .muted { color: #7a6670; font-size: 13px; }
    h2 { font-size: 16px; margin: 22px 0 10px; }
    .card { background: #ffffff; border: 1px solid #eadfe6; border-radius: 16px; padding: 14px 16px; margin-bottom: 10px; }
    .chip { display: inline-block; font-size: 11px; font-weight: 600; color: #9f1239; background: #ffe4e6; border-radius: 999px; padding: 3px 8px; margin-bottom: 6px; }
    h3 { margin: 0 0 6px; font-size: 15px; }
    p { margin: 0; font-size: 13px; line-height: 1.45; }
    .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #eadfe6; font-size: 11px; color: #7a6670; }
  </style>
</head>
<body>
  <div class="hero">
    <h1>SYNA</h1>
    <div class="muted">${copy.title}</div>
    <div class="muted">${copy.dateRange}</div>
  </div>
  ${mrsBlock}
  ${pamBlock}
  <h2>${copy.axesTitle}</h2>
  ${axesHtml}
  <h2>${copy.contextsTitle}</h2>
  ${contextsHtml}
  <h2>${copy.heatmapTitle}</h2>
  <div class="card"><p class="muted">${copy.translate('patterns_heatmap_pdf_note')}</p></div>
  <div class="footer">${copy.disclaimer}</div>
</body>
</html>`;
};
