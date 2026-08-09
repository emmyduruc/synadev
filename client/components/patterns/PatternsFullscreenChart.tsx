import { useMemo } from 'react';
import { View } from 'react-native';
import {
  Circle,
  Defs,
  LinearGradient,
  Line,
  Path,
  Rect,
  Stop,
  Svg,
  Text as SvgText,
} from 'react-native-svg';

import type { PatternChartPoint } from '@/lib/patterns/buildPatternChartSeries';
import {
  PATTERN_CHART_TYPE,
  type PatternChartType,
} from '@/lib/patterns/patternChartConstants';
import { semanticColors } from '@/lib/ui';

export type PatternsFullscreenChartProps = {
  points: readonly PatternChartPoint[];
  chartType: PatternChartType;
  width: number;
  height: number;
  selectedIndex: number | null;
  onSelectIndex: (index: number) => void;
  accentColor?: string;
  compact?: boolean;
  /** Fixed pixels between day points. Enables scrollable timelines. */
  dayWidth?: number;
};

const PAD_DEFAULT = {
  top: 18,
  right: 16,
  bottom: 28,
  left: 40,
} as const;

const PAD_COMPACT = {
  top: 8,
  right: 8,
  bottom: 24,
  left: 28,
} as const;

const formatAxisDate = (dateKey: string): string => {
  const parts = dateKey.split('-');

  if (parts.length !== 3) {
    return dateKey;
  }

  // DD.MM — matches Patterns readout and avoids US month/day confusion
  return `${parts[2]}.${parts[1]}`;
};

const formatTickValue = (value: number): string => {
  if (Math.abs(value) >= 100) {
    return `${Math.round(value)}`;
  }

  if (Number.isInteger(value)) {
    return String(value);
  }

  return value.toFixed(1);
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

export const PatternsFullscreenChart = ({
  points,
  chartType,
  width,
  height,
  selectedIndex,
  onSelectIndex,
  accentColor = semanticColors.splashBackground,
  compact = false,
  dayWidth,
}: PatternsFullscreenChartProps) => {
  const pad = compact ? PAD_COMPACT : PAD_DEFAULT;
  const fontSize = compact ? 9 : 10;
  const strokeWidth = compact ? 2 : 2.5;

  const chart = useMemo(() => {
    const plotWidth =
      dayWidth !== undefined
        ? Math.max((Math.max(points.length, 1) - 1) * dayWidth, 1)
        : Math.max(width - pad.left - pad.right, 1);
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

    let stepX = plotWidth;

    if (dayWidth !== undefined) {
      stepX = dayWidth;
    } else if (points.length > 1) {
      stepX = plotWidth / (points.length - 1);
    }

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
    const linePath = buildSmoothLine(
      drawnCoords.map((item) => ({ x: item.x, y: item.y })),
    );

    let areaPath = '';

    if (drawnCoords.length > 0) {
      const baseline = pad.top + plotHeight;
      areaPath = `${linePath} L ${drawnCoords[drawnCoords.length - 1].x} ${baseline} L ${drawnCoords[0].x} ${baseline} Z`;
    }

    const yTicks = [0, 0.5, 1].map((ratio) => ({
      value: max - ratio * range,
      y: pad.top + ratio * plotHeight,
    }));

    // Label every few days so a long daily timeline stays readable.
    // Each point is still one calendar day; ticks are just labels.
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

    if (
      points.length > 0 &&
      xLabelIndexes[xLabelIndexes.length - 1] !== points.length - 1
    ) {
      xLabelIndexes.push(points.length - 1);
    }

    return {
      plotHeight,
      coords,
      linePath,
      areaPath,
      yTicks,
      xLabelIndexes,
      stepX,
      barWidth: Math.max(stepX * 0.55, 3),
      hasData,
      xLabelY: height - Math.max(pad.bottom - fontSize - 2, 6),
    };
  }, [dayWidth, fontSize, height, pad.bottom, pad.left, pad.right, pad.top, points, width]);

  if (width < 40 || height < 40) {
    return <View />;
  }

  const isArea = chartType === PATTERN_CHART_TYPE.area;

  return (
    <View>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="patternsAreaFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={accentColor} stopOpacity={0.4} />
            <Stop offset="100%" stopColor={accentColor} stopOpacity={0.03} />
          </LinearGradient>
        </Defs>

        {chart.yTicks.map((tick) => (
          <Line
            key={`grid-${tick.y}`}
            x1={pad.left}
            y1={tick.y}
            x2={width - pad.right}
            y2={tick.y}
            stroke={semanticColors.ovum.lavender}
            strokeOpacity={0.35}
            strokeWidth={1}
          />
        ))}

        {chart.yTicks.map((tick) => (
          <SvgText
            key={`ylabel-${tick.y}`}
            x={pad.left - 6}
            y={tick.y + 3}
            fill={semanticColors.foregroundMuted}
            fontSize={fontSize}
            textAnchor="end">
            {formatTickValue(tick.value)}
          </SvgText>
        ))}

        {chart.hasData && isArea ? (
          <>
            {chart.areaPath ? (
              <Path d={chart.areaPath} fill="url(#patternsAreaFill)" />
            ) : null}
            {chart.linePath ? (
              <Path
                d={chart.linePath}
                fill="none"
                stroke={accentColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}
          </>
        ) : null}

        {chart.hasData && !isArea
          ? chart.coords.map((coord, index) => {
              if (!coord.hasValue) {
                return null;
              }

              const barHeight = pad.top + chart.plotHeight - coord.y;
              const isDimmed = selectedIndex !== null && selectedIndex !== index;

              return (
                <Rect
                  key={`bar-${points[index].dateKey}`}
                  x={coord.x - chart.barWidth / 2}
                  y={coord.y}
                  width={chart.barWidth}
                  height={Math.max(barHeight, 2)}
                  rx={3}
                  fill={accentColor}
                  opacity={isDimmed ? 0.35 : 0.92}
                />
              );
            })
          : null}

        {selectedIndex !== null && chart.coords[selectedIndex] ? (
          <>
            <Line
              x1={chart.coords[selectedIndex].x}
              y1={pad.top}
              x2={chart.coords[selectedIndex].x}
              y2={pad.top + chart.plotHeight}
              stroke={semanticColors.ovum.dustyRose}
              strokeWidth={1.25}
              strokeDasharray="4 4"
            />
            {chart.coords[selectedIndex].hasValue ? (
              <Circle
                cx={chart.coords[selectedIndex].x}
                cy={chart.coords[selectedIndex].y}
                r={compact ? 4 : 5}
                fill={semanticColors.card}
                stroke={accentColor}
                strokeWidth={2}
              />
            ) : null}
          </>
        ) : null}

        {chart.xLabelIndexes.map((index) => {
          const point = points[index];
          const coord = chart.coords[index];

          if (!point || !coord) {
            return null;
          }

          return (
            <SvgText
              key={`xlabel-${point.dateKey}`}
              x={coord.x}
              y={chart.xLabelY}
              fill={semanticColors.foregroundMuted}
              fontSize={fontSize}
              textAnchor="middle">
              {formatAxisDate(point.dateKey)}
            </SvgText>
          );
        })}

        {chart.coords.map((coord, index) => (
          <Rect
            key={`hit-${points[index].dateKey}`}
            x={coord.x - Math.max(chart.stepX, 10) / 2}
            y={pad.top}
            width={Math.max(chart.stepX, 10)}
            height={chart.plotHeight}
            fill="transparent"
            onPress={() => {
              onSelectIndex(index);
            }}
          />
        ))}
      </Svg>
    </View>
  );
};
