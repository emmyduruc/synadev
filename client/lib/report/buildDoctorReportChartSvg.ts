import type { PatternChartPoint } from '@/lib/patterns/buildPatternChartSeries';
import { PATTERN_CHART_TYPE, type PatternChartType } from '@/lib/patterns/patternChartConstants';
import {
  computeChartGeometry,
  formatChartAxisDate,
  formatChartTickValue,
} from '@/lib/report/chartGeometry';

export type BuildDoctorReportChartSvgInput = {
  points: readonly PatternChartPoint[];
  width: number;
  height: number;
  chartType: PatternChartType;
  accentColor?: string;
  referenceValue?: number | null;
};

export const buildDoctorReportChartSvg = ({
  points,
  width,
  height,
  chartType,
  accentColor = '#9f1239',
  referenceValue,
}: BuildDoctorReportChartSvgInput): string => {
  const geometry = computeChartGeometry({
    points,
    width,
    height,
    chartType,
    referenceValue,
  });

  if (!geometry.hasData) {
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${width}" height="${height}" rx="12" fill="#faf7f8" stroke="#eadfe6"/>
      <text x="${width / 2}" y="${height / 2}" text-anchor="middle" fill="#7a6670" font-size="12">-</text>
    </svg>`;
  }

  const gridLines = geometry.yTicks
    .map(
      (tick) =>
        `<line x1="${geometry.pad.left}" y1="${tick.y}" x2="${width - geometry.pad.right}" y2="${tick.y}" stroke="#e8dff0" stroke-opacity="0.8"/>`,
    )
    .join('');

  const yLabels = geometry.yTicks
    .map(
      (tick) =>
        `<text x="${geometry.pad.left - 6}" y="${tick.y + 3}" text-anchor="end" fill="#7a6670" font-size="9">${formatChartTickValue(tick.value)}</text>`,
    )
    .join('');

  const xLabels = geometry.xLabelIndexes
    .map((index) => {
      const point = points[index];
      const coord = geometry.coords[index];

      if (!point || !coord) {
        return '';
      }

      return `<text x="${coord.x}" y="${height - 6}" text-anchor="middle" fill="#7a6670" font-size="9">${formatChartAxisDate(point.dateKey)}</text>`;
    })
    .join('');

  const referenceLine =
    geometry.referenceY !== null
      ? `<line x1="${geometry.pad.left}" y1="${geometry.referenceY}" x2="${width - geometry.pad.right}" y2="${geometry.referenceY}" stroke="#9f1239" stroke-width="1" stroke-dasharray="4 4" opacity="0.7"/>`
      : '';

  const isArea = chartType === PATTERN_CHART_TYPE.area;

  const seriesMarkup = isArea
    ? `${geometry.areaPath ? `<path d="${geometry.areaPath}" fill="${accentColor}" fill-opacity="0.18"/>` : ''}
       ${geometry.linePath ? `<path d="${geometry.linePath}" fill="none" stroke="${accentColor}" stroke-width="2" stroke-linecap="round"/>` : ''}`
    : geometry.bars
        .map(
          (bar) =>
            `<rect x="${bar.x}" y="${bar.y}" width="${bar.width}" height="${bar.height}" rx="3" fill="${accentColor}" opacity="0.9"/>`,
        )
        .join('');

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" role="img">
    <rect x="0" y="0" width="${width}" height="${height}" rx="12" fill="#ffffff" stroke="#eadfe6"/>
    ${gridLines}
    ${yLabels}
    ${referenceLine}
    ${seriesMarkup}
    ${xLabels}
  </svg>`;
};

export type BuildDoctorReportHeatmapSvgInput = {
  symptomLabels: readonly { symptomId: string; label: string }[];
  dateKeys: readonly string[];
  cells: ReadonlyMap<string, ReadonlyMap<string, boolean>>;
  width?: number;
  cellSize?: number;
};

export const buildDoctorReportHeatmapSvg = ({
  symptomLabels,
  dateKeys,
  cells,
  width = 520,
  cellSize = 10,
}: BuildDoctorReportHeatmapSvgInput): string => {
  const labelWidth = 88;
  const gap = 2;
  const height = symptomLabels.length * (cellSize + gap) + 8;

  const rows = symptomLabels
    .map((row, rowIndex) => {
      const y = 4 + rowIndex * (cellSize + gap);
      const label = `<text x="0" y="${y + cellSize - 1}" fill="#3b2a32" font-size="9">${row.label.slice(0, 14)}</text>`;
      const dots = dateKeys
        .map((dateKey, colIndex) => {
          const logged = cells.get(row.symptomId)?.get(dateKey) ?? false;
          const x = labelWidth + colIndex * (cellSize + gap);
          const fill = logged ? '#9f1239' : '#f1e8ee';
          return `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" fill="${fill}"/>`;
        })
        .join('');

      return `${label}${dots}`;
    })
    .join('');

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" role="img">${rows}</svg>`;
};
