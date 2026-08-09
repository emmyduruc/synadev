import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PatternsFullscreenChart } from '@/components/patterns/PatternsFullscreenChart';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { DASHBOARD_SURFACE } from '@/lib/dashboard/surfaces';
import type { PatternChartSeries } from '@/lib/patterns/buildPatternChartSeries';
import {
  PATTERN_CHART_DAY_WIDTH,
  PATTERN_CHART_METRIC,
  PATTERN_CHART_METRIC_LABEL_KEY,
  PATTERN_CHART_METRIC_UNIT_KEY,
  PATTERN_CHART_TYPE,
  type PatternChartMetricId,
  type PatternChartType,
} from '@/lib/patterns/patternChartConstants';
import { cn, semanticColors } from '@/lib/ui';

export type PatternsChartWindow = {
  from: string;
  to: string;
  todayKey: string;
};

export type PatternsGraphContentProps = {
  chartSeries: readonly PatternChartSeries[];
  chartWindow: PatternsChartWindow;
  onExitGraphMode: () => void;
  onExportPdf: () => void;
  isExporting: boolean;
};

const CHIP_BASE =
  'h-7 min-h-0 items-center justify-center rounded-full border px-2.5 py-0';
const CHIP_ACTIVE = `${CHIP_BASE} border-primary-200 bg-card`;
const CHIP_IDLE = `${CHIP_BASE} border-transparent bg-card/70`;

/** Match compact chart left/right padding used for content width. */
const CHART_PAD_LEFT = 28;
const CHART_PAD_RIGHT = 8;

const formatDisplayDate = (dateKey: string): string => {
  const parts = dateKey.split('-');

  if (parts.length !== 3) {
    return dateKey;
  }

  return `${parts[2]}.${parts[1]}.${parts[0]}`;
};

const formatMetricValue = (value: number | null): string => {
  if (value === null) {
    return '-';
  }

  if (value >= 100) {
    return Math.round(value).toLocaleString();
  }

  if (Number.isInteger(value)) {
    return String(value);
  }

  return value.toFixed(1);
};

export const PatternsGraphContent = ({
  chartSeries,
  chartWindow,
  onExitGraphMode,
  onExportPdf,
  isExporting,
}: PatternsGraphContentProps) => {
  const { t } = useTranslate();
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const timelineRef = useRef<ScrollView>(null);
  const didInitialScrollRef = useRef(false);

  const [metricId, setMetricId] = useState<PatternChartMetricId>(
    chartSeries[0]?.id ?? PATTERN_CHART_METRIC.sleep,
  );
  const [chartType, setChartType] = useState<PatternChartType>(PATTERN_CHART_TYPE.area);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  const isLandscape = windowWidth > windowHeight;
  const sidePad = Math.max(insets.left, insets.right, 8);

  const activeSeries = useMemo(() => {
    const found = chartSeries.find((series) => series.id === metricId);
    return found ?? chartSeries[0] ?? null;
  }, [chartSeries, metricId]);

  const pointCount = activeSeries?.points.length ?? 0;

  const contentWidth = useMemo(() => {
    if (pointCount <= 1) {
      return Math.max(viewportSize.width, CHART_PAD_LEFT + CHART_PAD_RIGHT);
    }

    return (
      CHART_PAD_LEFT +
      CHART_PAD_RIGHT +
      (pointCount - 1) * PATTERN_CHART_DAY_WIDTH
    );
  }, [pointCount, viewportSize.width]);

  const todayIndex = useMemo(() => {
    if (!activeSeries) {
      return -1;
    }

    return activeSeries.points.findIndex(
      (point) => point.dateKey === chartWindow.todayKey,
    );
  }, [activeSeries, chartWindow.todayKey]);

  useEffect(() => {
    setSelectedIndex(null);
  }, [metricId, chartType]);

  useEffect(() => {
    didInitialScrollRef.current = false;
  }, [chartWindow.todayKey, pointCount]);

  const scrollToToday = (animated: boolean) => {
    if (todayIndex < 0 || viewportSize.width <= 0) {
      return;
    }

    const targetX = Math.max(
      0,
      todayIndex * PATTERN_CHART_DAY_WIDTH - viewportSize.width * 0.7,
    );
    timelineRef.current?.scrollTo({ x: targetX, animated });
  };

  const selectedPoint =
    activeSeries && selectedIndex !== null
      ? activeSeries.points[selectedIndex]
      : null;

  const latestWithValue = useMemo(() => {
    if (!activeSeries || todayIndex < 0) {
      return null;
    }

    for (let index = todayIndex; index >= 0; index -= 1) {
      const point = activeSeries.points[index];

      if (point.value !== null) {
        return point;
      }
    }

    return null;
  }, [activeSeries, todayIndex]);

  const detailPoint = selectedPoint ?? latestWithValue;
  const unitLabel = activeSeries
    ? t(PATTERN_CHART_METRIC_UNIT_KEY[activeSeries.id])
    : '';
  const detailLabel = detailPoint
    ? `${formatDisplayDate(detailPoint.dateKey)}  ·  ${formatMetricValue(detailPoint.value)} ${unitLabel}`
    : t('patterns_graph_tap_day_hint');

  return (
    <Box
      flex={1}
      style={{
        paddingLeft: sidePad,
        paddingRight: sidePad,
        paddingTop: Math.max(insets.top, 4),
        paddingBottom: Math.max(insets.bottom, 4),
      }}>
      <Box direction="row" align="center" justify="between" className="mb-1 gap-2">
        <Box className="min-w-0 flex-1 pr-2">
          <Text size="2xs" weight="bold" responsive={false} numberOfLines={1}>
            {t('patterns_graph_fullscreen_title')}
          </Text>
          <Text size="2xs" color="foreground-muted" responsive={false} numberOfLines={1}>
            {t('patterns_pdf_date_range', {
              from: chartWindow.from,
              to: chartWindow.to,
            })}
          </Text>
        </Box>

        <Box direction="row" align="center" className="shrink-0 gap-1">
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('patterns_chart_type_area')}
            onPress={() => {
              setChartType(PATTERN_CHART_TYPE.area);
            }}
            className={
              chartType === PATTERN_CHART_TYPE.area ? CHIP_ACTIVE : CHIP_IDLE
            }>
            <Text
              size="2xs"
              weight="semibold"
              responsive={false}
              color={
                chartType === PATTERN_CHART_TYPE.area ? 'primary' : 'foreground-muted'
              }>
              {t('patterns_chart_type_area')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('patterns_chart_type_bar')}
            onPress={() => {
              setChartType(PATTERN_CHART_TYPE.bar);
            }}
            className={
              chartType === PATTERN_CHART_TYPE.bar ? CHIP_ACTIVE : CHIP_IDLE
            }>
            <Text
              size="2xs"
              weight="semibold"
              responsive={false}
              color={
                chartType === PATTERN_CHART_TYPE.bar ? 'primary' : 'foreground-muted'
              }>
              {t('patterns_chart_type_bar')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('patterns_export_pdf_accessibility')}
            disabled={isExporting}
            onPress={onExportPdf}
            className={cn(CHIP_ACTIVE, isExporting && 'opacity-40')}>
            <Text size="2xs" weight="semibold" responsive={false} color="primary">
              {t('patterns_export_pdf')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('patterns_mode_cards')}
            onPress={onExitGraphMode}
            className={CHIP_ACTIVE}>
            <Text size="2xs" weight="semibold" responsive={false} color="primary">
              {t('patterns_mode_cards')}
            </Text>
          </TouchableOpacity>
        </Box>
      </Box>

      {!isLandscape ? (
        <Box className={cn(DASHBOARD_SURFACE.lavenderShell, 'mb-1 px-2 py-1')}>
          <Text size="2xs" color="foreground" responsive={false} numberOfLines={1}>
            {t('patterns_graph_rotate_hint')}
          </Text>
        </Box>
      ) : null}

      <Box
        flex={1}
        className={cn(DASHBOARD_SURFACE.lavenderShell, 'overflow-hidden px-1 pt-1 pb-0')}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setViewportSize({
            width: Math.max(width - 4, 0),
            height: Math.max(height - 2, 0),
          });
        }}>
        {activeSeries && viewportSize.height > 0 ? (
          <ScrollView
            ref={timelineRef}
            horizontal
            decelerationRate="fast"
            showsHorizontalScrollIndicator
            bounces
            scrollEventThrottle={16}
            onContentSizeChange={() => {
              if (!didInitialScrollRef.current) {
                didInitialScrollRef.current = true;
                scrollToToday(false);
              }
            }}>
            <PatternsFullscreenChart
              points={activeSeries.points}
              chartType={chartType}
              width={contentWidth}
              height={viewportSize.height}
              dayWidth={PATTERN_CHART_DAY_WIDTH}
              selectedIndex={selectedIndex}
              onSelectIndex={setSelectedIndex}
              accentColor={semanticColors.splashBackground}
              compact
            />
          </ScrollView>
        ) : (
          <Box flex={1} align="center" justify="center">
            <Text size="2xs" color="foreground-muted" responsive={false}>
              {t('patterns_graph_empty')}
            </Text>
          </Box>
        )}
      </Box>

      <Box
        direction="row"
        align="center"
        justify="between"
        className={cn(DASHBOARD_SURFACE.nestedLift, 'mt-1 min-h-7 px-2.5 py-1')}>
        <Text
          size="2xs"
          weight="semibold"
          color="primary"
          responsive={false}
          numberOfLines={1}
          className="flex-1 pr-2">
          {detailLabel}
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={t('patterns_graph_jump_today')}
          onPress={() => {
            scrollToToday(true);
          }}
          className="mr-2">
          <Text size="2xs" weight="semibold" responsive={false} color="primary">
            {t('patterns_graph_jump_today')}
          </Text>
        </TouchableOpacity>
        <Text
          size="2xs"
          color="foreground-muted"
          responsive={false}
          numberOfLines={1}
          className="shrink-0">
          {t('patterns_disclaimer')}
        </Text>
      </Box>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-1 max-h-8"
        contentContainerStyle={{
          alignItems: 'center',
          gap: 6,
          paddingVertical: 0,
        }}>
        {chartSeries.map((series) => {
          const isActive = series.id === metricId;

          return (
            <TouchableOpacity
              key={series.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              onPress={() => {
                setMetricId(series.id);
              }}
              className={isActive ? CHIP_ACTIVE : CHIP_IDLE}>
              <Text
                size="2xs"
                weight="semibold"
                responsive={false}
                color={isActive ? 'primary' : 'foreground-muted'}>
                {t(PATTERN_CHART_METRIC_LABEL_KEY[series.id])}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Box>
  );
};
