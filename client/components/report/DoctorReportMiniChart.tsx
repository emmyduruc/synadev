import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import { PatternsFullscreenChart } from '@/components/patterns/PatternsFullscreenChart';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { PATTERN_CHART_METRIC_LABEL_KEY } from '@/lib/patterns/patternChartConstants';
import type { DoctorReportChartBlock } from '@/lib/report/doctorReportTypes';
import { semanticColors } from '@/lib/ui';

export type DoctorReportMiniChartProps = {
  chart: DoctorReportChartBlock;
};

export const DoctorReportMiniChart = ({ chart }: DoctorReportMiniChartProps) => {
  const { t } = useTranslate();
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = Math.max(screenWidth - 64, 280);
  const chartHeight = 140;

  const hasValues = useMemo(
    () => chart.points.some((point) => point.value !== null),
    [chart.points],
  );

  return (
    <Box className="rounded-xl border border-border bg-card/80 p-3">
      <Text size="2xs" weight="semibold" className="mb-2 text-primary">
        {t(PATTERN_CHART_METRIC_LABEL_KEY[chart.metricId])}
      </Text>

      {hasValues ? (
        <PatternsFullscreenChart
          points={chart.points}
          chartType={chart.chartType}
          width={chartWidth}
          height={chartHeight}
          selectedIndex={null}
          onSelectIndex={() => {}}
          accentColor={semanticColors.splashBackground}
          compact
        />
      ) : (
        <Box
          align="center"
          justify="center"
          className="rounded-lg bg-muted/30"
          style={{ height: chartHeight }}>
          <Text size="xs" className="text-black/50">
            {t('doctor_report_chart_no_data')}
          </Text>
        </Box>
      )}

      <Text size="2xs" className="mt-2 leading-snug text-black/70">
        {t(chart.captionKey, chart.captionParams)}
      </Text>
    </Box>
  );
};
