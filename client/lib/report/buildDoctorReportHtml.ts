import { PATTERN_CHART_METRIC_LABEL_KEY } from '@/lib/patterns/patternChartConstants';
import {
  buildDoctorReportChartSvg,
  buildDoctorReportHeatmapSvg,
} from '@/lib/report/buildDoctorReportChartSvg';
import type { DoctorReportViewModel } from '@/lib/report/doctorReportTypes';

export type DoctorReportHtmlCopy = {
  title: string;
  subtitle: string;
  generatedLabel: string;
  patientLabel: string;
  ageLabel: string;
  windowLabel: string;
  scoresTitle: string;
  clinicalTitle: string;
  medicationsTitle: string;
  concernsTitle: string;
  concernsEmpty: string;
  medicationsEmpty: string;
  symptomGridTitle: string;
  disclaimer: string;
  translate: (key: string, options?: Record<string, unknown>) => string;
};

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const renderParagraphs = (
  paragraphs: DoctorReportViewModel['sections'][number]['paragraphs'],
  translate: DoctorReportHtmlCopy['translate'],
): string =>
  paragraphs
    .map(
      (block) =>
        `<p>${escapeHtml(translate(block.bodyKey, block.params))}</p>`,
    )
    .join('');

const renderCharts = (
  charts: DoctorReportViewModel['sections'][number]['charts'],
  translate: DoctorReportHtmlCopy['translate'],
): string =>
  charts
    .map((chart) => {
      const svg = buildDoctorReportChartSvg({
        points: chart.points,
        width: 520,
        height: 160,
        chartType: chart.chartType,
        referenceValue: chart.referenceValue,
      });

      return `<div class="chart-block">
        <div class="chart-label">${escapeHtml(translate(PATTERN_CHART_METRIC_LABEL_KEY[chart.metricId]))}</div>
        ${svg}
        <p class="chart-caption">${escapeHtml(translate(chart.captionKey, chart.captionParams))}</p>
      </div>`;
    })
    .join('');

const renderHeatmap = (
  report: DoctorReportViewModel,
  translate: DoctorReportHtmlCopy['translate'],
): string => {
  const heatmap = report.heatmap;

  if (!heatmap || heatmap.isEmpty || !heatmap.hasPeriodData) {
    return '';
  }

  const visibleDates = heatmap.dateKeys.slice(-14);
  const rows = heatmap.rows.slice(0, 6);
  const cellMap = new Map<string, Map<string, boolean>>();

  for (const row of rows) {
    const byDate = new Map<string, boolean>();

    for (const cell of row.cells) {
      byDate.set(cell.dateKey, cell.logged);
    }

    cellMap.set(row.symptomId, byDate);
  }

  const svg = buildDoctorReportHeatmapSvg({
    symptomLabels: rows.map((row) => ({
      symptomId: row.symptomId,
      label: translate(`symptom_${row.symptomId}`),
    })),
    dateKeys: visibleDates,
    cells: cellMap,
  });

  return `<div class="chart-block">
    <div class="chart-label">${escapeHtml(translate('doctor_report_symptom_grid_title'))}</div>
    ${svg}
  </div>`;
};

export const buildDoctorReportHtml = (
  report: DoctorReportViewModel,
  copy: DoctorReportHtmlCopy,
): string => {
  const sectionsHtml = report.sections
    .map((section) => {
      const heatmapHtml = section.showSymptomGrid ? renderHeatmap(report, copy.translate) : '';

      return `<section class="section">
        <h2>${escapeHtml(copy.translate(section.titleKey))}</h2>
        ${renderParagraphs(section.paragraphs, copy.translate)}
        <div class="charts">${renderCharts(section.charts, copy.translate)}${heatmapHtml}</div>
      </section>`;
    })
    .join('');

  const scoresHtml = report.scores
    .map((score) => {
      const detail = score.detailKey
        ? `<div class="score-detail">${escapeHtml(copy.translate(score.detailKey, score.detailParams))}</div>`
        : '';

      return `<div class="score-card">
        <div class="score-label">${escapeHtml(copy.translate(score.labelKey))}</div>
        <div class="score-value">${escapeHtml(score.value)}</div>
        ${detail}
      </div>`;
    })
    .join('');

  const clinicalHtml = report.clinicalRows
    .map(
      (row) =>
        `<tr><th>${escapeHtml(copy.translate(row.labelKey))}</th><td>${escapeHtml(row.value)}</td></tr>`,
    )
    .join('');

  const medicationsHtml =
    report.medications.length > 0
      ? report.medications
          .map((med) => {
            const dose = med.dose?.trim() ? ` · ${med.dose.trim()}` : '';
            return `<li>${escapeHtml(`${med.name}${dose}`)}</li>`;
          })
          .join('')
      : `<li class="muted">${escapeHtml(copy.medicationsEmpty)}</li>`;

  const concernsHtml = report.concerns
    ? `<p>${escapeHtml(report.concerns)}</p>`
    : `<p class="muted">${escapeHtml(copy.concernsEmpty)}</p>`;

  const ageLine =
    report.ageYears !== null
      ? `<div class="muted">${escapeHtml(copy.ageLabel)}: ${report.ageYears}</div>`
      : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: -apple-system, Helvetica, Arial, sans-serif; color: #1a1a1a; margin: 0; padding: 28px; background: #fff8f6; }
    .hero { background: linear-gradient(135deg, #f3e8ff, #ffe4e1 55%, #fff7ed); border-radius: 24px; padding: 24px; margin-bottom: 20px; }
    h1 { margin: 0 0 4px; font-size: 26px; letter-spacing: 0.04em; }
    h2 { font-size: 15px; margin: 0 0 8px; letter-spacing: 0.02em; }
    .muted { color: #666; font-size: 12px; line-height: 1.4; }
    .summary { background: #ffffff; border: 1px solid #eadfe6; border-radius: 16px; padding: 16px; margin-bottom: 16px; font-size: 13px; line-height: 1.5; }
    .section { background: #ffffff; border: 1px solid #eadfe6; border-radius: 16px; padding: 16px; margin-bottom: 14px; }
    .section p { margin: 0 0 10px; font-size: 13px; line-height: 1.5; }
    .charts { display: flex; flex-direction: column; gap: 12px; margin-top: 10px; }
    .chart-block { border: 1px solid #f0e6ec; border-radius: 12px; padding: 10px; background: #fffcfb; }
    .chart-label { font-size: 11px; font-weight: 600; margin-bottom: 6px; color: #9f1239; }
    .chart-caption { margin: 8px 0 0; font-size: 11px; color: #555; line-height: 1.4; }
    .scores { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 14px; }
    .score-card { flex: 1 1 140px; background: #ffffff; border: 1px solid #eadfe6; border-radius: 14px; padding: 12px; }
    .score-label { font-size: 11px; color: #666; margin-bottom: 4px; }
    .score-value { font-size: 20px; font-weight: 700; }
    .score-detail { font-size: 11px; color: #555; margin-top: 4px; line-height: 1.35; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 14px; background: #fff; border: 1px solid #eadfe6; border-radius: 12px; overflow: hidden; }
    th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #f0e6ec; }
    th { width: 42%; color: #666; font-weight: 600; }
    .block { background: #ffffff; border: 1px solid #eadfe6; border-radius: 16px; padding: 16px; margin-bottom: 14px; }
    ul { margin: 8px 0 0; padding-left: 18px; font-size: 13px; line-height: 1.45; }
    .footer { margin-top: 20px; padding-top: 12px; border-top: 1px solid #eadfe6; font-size: 11px; color: #666; line-height: 1.45; }
  </style>
</head>
<body>
  <div class="hero">
    <h1>SYNA</h1>
    <div class="muted">${escapeHtml(copy.title)}</div>
    <div class="muted">${escapeHtml(copy.subtitle)}</div>
    <div class="muted">${escapeHtml(copy.generatedLabel)}</div>
    <div style="margin-top:10px;font-size:14px;font-weight:600;">${escapeHtml(copy.patientLabel)}: ${escapeHtml(report.patientName)}</div>
    ${ageLine}
    <div class="muted">${escapeHtml(copy.windowLabel)}</div>
  </div>

  <div class="summary">${escapeHtml(copy.translate(report.summaryKey, report.summaryParams))}</div>

  <h2>${escapeHtml(copy.scoresTitle)}</h2>
  <div class="scores">${scoresHtml}</div>

  ${sectionsHtml}

  <div class="block">
    <h2>${escapeHtml(copy.clinicalTitle)}</h2>
    <table>${clinicalHtml}</table>
  </div>

  <div class="block">
    <h2>${escapeHtml(copy.medicationsTitle)}</h2>
    <ul>${medicationsHtml}</ul>
  </div>

  <div class="block">
    <h2>${escapeHtml(copy.concernsTitle)}</h2>
    ${concernsHtml}
  </div>

  <div class="footer">${escapeHtml(copy.disclaimer)}</div>
</body>
</html>`;
};
