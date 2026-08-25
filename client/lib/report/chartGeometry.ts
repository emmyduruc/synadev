import type { PatternChartPoint } from '@/lib/patterns/buildPatternChartSeries';
import { PATTERN_CHART_TYPE, type PatternChartType } from '@/lib/patterns/patternChartConstants';

export type ChartGeometryPad = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type ChartGeometryInput = {
  points: readonly PatternChartPoint[];
  width: number;
  height: number;
  chartType: PatternChartType;
  pad?: ChartGeometryPad;
  referenceValue?: number | null;
};

export type ChartGeometryResult = {
  linePath: string;
  areaPath: string;
  bars: readonly { x: number; y: number; width: number; height: number }[];
  yTicks: readonly { value: number; y: number }[];
  xLabelIndexes: readonly number[];
  coords: readonly { x: number; y: number; hasValue: boolean }[];
  referenceY: number | null;
  plotHeight: number;
  pad: ChartGeometryPad;
  hasData: boolean;
};

const DEFAULT_PAD: ChartGeometryPad = {
  top: 12,
  right: 12,
  bottom: 22,
  left: 32,
};

const buildSmoothLine = (coords: readonly { x: number; y: number }[]): string => {
  if (coords.length === 0) {
    return '';
  }

  if (coords.length === 1) {
    return `M ${coords[0].x} ${coords[0].y}`;
  }

  let path = `M ${coords[0].x} ${coords[0].y}`;

  for (let index = 0; index < coords.length - 1; index += 1) {
    const current = coords[index];
    const next = coords[index + 1];
    const controlX = (current.x + next.x) / 2;
    path += ` Q ${current.x} ${current.y} ${controlX} ${(current.y + next.y) / 2}`;
  }

  const last = coords[coords.length - 1];
  path += ` T ${last.x} ${last.y}`;

  return path;
};

export const computeChartGeometry = ({
  points,
  width,
  height,
  chartType,
  pad = DEFAULT_PAD,
  referenceValue,
}: ChartGeometryInput): ChartGeometryResult => {
  const plotWidth = Math.max(width - pad.left - pad.right, 1);
  const plotHeight = Math.max(height - pad.top - pad.bottom, 1);
  const numeric = points
    .map((point) => point.value)
    .filter((value): value is number => value !== null);

  const hasData = numeric.length > 0;
  const minRaw = hasData ? Math.min(...numeric) : 0;
  const maxRaw = hasData ? Math.max(...numeric) : 1;
  const span = maxRaw - minRaw || 1;
  const min = hasData ? Math.max(0, minRaw - span * 0.08) : 0;
  const max = hasData ? maxRaw + span * 0.08 : 1;
  const range = max - min || 1;
  const stepX = points.length > 1 ? plotWidth / (points.length - 1) : plotWidth;

  const coords = points.map((point, index) => {
    const value = point.value ?? min;
    const x = pad.left + index * stepX;
    const y = pad.top + plotHeight - ((value - min) / range) * plotHeight;

    return {
      x,
      y,
      hasValue: point.value !== null,
    };
  });

  const drawnCoords = coords.filter((item) => item.hasValue);
  const linePath = buildSmoothLine(drawnCoords.map((item) => ({ x: item.x, y: item.y })));

  let areaPath = '';

  if (drawnCoords.length > 0) {
    const baseline = pad.top + plotHeight;
    areaPath = `${linePath} L ${drawnCoords[drawnCoords.length - 1].x} ${baseline} L ${drawnCoords[0].x} ${baseline} Z`;
  }

  const barWidth = Math.max(stepX * 0.55, 3);
  const bars = coords
    .filter((coord) => coord.hasValue)
    .map((coord) => ({
      x: coord.x - barWidth / 2,
      y: coord.y,
      width: barWidth,
      height: Math.max(pad.top + plotHeight - coord.y, 2),
    }));

  const yTicks = [0, 0.5, 1].map((ratio) => ({
    value: max - ratio * range,
    y: pad.top + ratio * plotHeight,
  }));

  let labelStep = 1;

  if (points.length > 40) {
    labelStep = 7;
  } else if (points.length > 14) {
    labelStep = 3;
  } else if (points.length > 8) {
    labelStep = 2;
  }

  const xLabelIndexes: number[] = [];

  for (let index = 0; index < points.length; index += labelStep) {
    xLabelIndexes.push(index);
  }

  if (points.length > 0 && xLabelIndexes[xLabelIndexes.length - 1] !== points.length - 1) {
    xLabelIndexes.push(points.length - 1);
  }

  let referenceY: number | null = null;

  if (
    referenceValue !== null &&
    referenceValue !== undefined &&
    Number.isFinite(referenceValue) &&
    referenceValue >= min &&
    referenceValue <= max
  ) {
    referenceY = pad.top + plotHeight - ((referenceValue - min) / range) * plotHeight;
  }

  return {
    linePath,
    areaPath,
    bars,
    yTicks,
    xLabelIndexes,
    coords,
    referenceY,
    plotHeight,
    pad,
    hasData: chartType === PATTERN_CHART_TYPE.bar ? bars.length > 0 : hasData,
  };
};

export const formatChartAxisDate = (dateKey: string): string => {
  const parts = dateKey.split('-');

  if (parts.length !== 3) {
    return dateKey;
  }

  return `${parts[2]}.${parts[1]}`;
};

export const formatChartTickValue = (value: number): string => {
  if (Math.abs(value) >= 100) {
    return `${Math.round(value)}`;
  }

  if (Number.isInteger(value)) {
    return String(value);
  }

  return value.toFixed(1);
};
