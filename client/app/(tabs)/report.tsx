import { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';

import { CourseCooccurrenceCard } from '@/components/course/CourseCooccurrenceCard';
import { CourseDayDetailSheet } from '@/components/course/CourseDayDetailSheet';
import { CourseRowInsightSheet } from '@/components/course/CourseRowInsightSheet';
import { SAFE_AREA_EDGES, SafeAreaScreen } from '@/components/layout/SafeAreaScreen';
import { SynaGradientBackground } from '@/components/layout/SynaGradientBackground';
import { MascotLoadingGate } from '@/components/loading/MascotLoadingGate';
import { ReportCoverageCard } from '@/components/report/ReportCoverageCard';
import { ReportDateRangeSheet } from '@/components/report/ReportDateRangeSheet';
import { ReportPeriodHeader } from '@/components/report/ReportPeriodHeader';
import { ReportQuestionsCard } from '@/components/report/ReportQuestionsCard';
import { AppHeader, Box } from '@/components/ui';
import { useCourseScreenData } from '@/hooks/useCourseScreenData';
import { useReportDateRange } from '@/hooks/useReportDateRange';
import { useTranslate } from '@/hooks/useTranslate';
import { buildCourseDayDetail } from '@/lib/course/buildCourseDayDetail';
import { buildCourseRowInsight } from '@/lib/course/buildCourseRowInsight';
import type {
  CourseCooccurrenceRow,
  CourseCooccurrenceRowId,
  CourseCooccurrenceTile,
} from '@/lib/course/courseCooccurrence';
import { LOADING_VARIANT } from '@/lib/loading/loadingVariants';
import {
  formatReportPeriodMonthYear,
  formatReportPeriodRangeLabel,
} from '@/lib/report/formatReportPeriod';

const ReportTabScreen = () => {
  const { t, language } = useTranslate();
  const [isRangeSheetOpen, setIsRangeSheetOpen] = useState(false);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<CourseCooccurrenceRowId | null>(
    null,
  );

  const {
    range,
    bounds,
    windowDays,
    isLoading: isRangeLoading,
    applyRange,
    resetToDefault,
  } = useReportDateRange(true);

  const {
    frequencySummary,
    cooccurrenceSummary,
    symptomLogs,
    periodDateKeys,
    healthRows,
    isLoading: isCourseLoading,
  } = useCourseScreenData();

  const monthYearLabel = useMemo(
    () => formatReportPeriodMonthYear(range.toDateKey, language),
    [language, range.toDateKey],
  );

  const rangeLabel = useMemo(
    () => formatReportPeriodRangeLabel(range.fromDateKey, range.toDateKey),
    [range.fromDateKey, range.toDateKey],
  );

  const selectedDetail = useMemo(() => {
    if (!selectedDateKey) {
      return null;
    }

    return buildCourseDayDetail({
      dateKey: selectedDateKey,
      symptomLogs,
      healthRows,
      periodDateKeys,
    });
  }, [healthRows, periodDateKeys, selectedDateKey, symptomLogs]);

  const selectedRowInsight = useMemo(() => {
    if (!selectedRowId) {
      return null;
    }

    return buildCourseRowInsight(cooccurrenceSummary, selectedRowId);
  }, [cooccurrenceSummary, selectedRowId]);

  const highlightedDateKeys = useMemo(() => {
    if (!selectedRowInsight) {
      return undefined;
    }

    return new Set(selectedRowInsight.eventDateKeys);
  }, [selectedRowInsight]);

  const handlePressTile = (_row: CourseCooccurrenceRow, tile: CourseCooccurrenceTile) => {
    if (tile.kind === 'empty') {
      return;
    }

    const detail = buildCourseDayDetail({
      dateKey: tile.dateKey,
      symptomLogs,
      healthRows,
      periodDateKeys,
    });

    if (!detail.hasContent) {
      return;
    }

    setSelectedRowId(null);
    setSelectedDateKey(tile.dateKey);
  };

  const handlePressRow = (row: CourseCooccurrenceRow) => {
    if (selectedRowId === row.id) {
      setSelectedRowId(null);
      return;
    }

    const insight = buildCourseRowInsight(cooccurrenceSummary, row.id);

    if (!insight) {
      return;
    }

    setSelectedDateKey(null);
    setSelectedRowId(row.id);
  };

  const isReady = !isRangeLoading && !isCourseLoading;

  return (
    <SynaGradientBackground>
      <SafeAreaScreen edges={SAFE_AREA_EDGES.top} style={{ backgroundColor: 'transparent' }}>
        <Box flex={1}>
          <AppHeader title={t('tab_report_title')} showBack={false} />

          <MascotLoadingGate
            isReady={isReady}
            variant={LOADING_VARIANT.report}
            className="flex-1">
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 32, flexGrow: 1 }}
              showsVerticalScrollIndicator={false}>
              <Box paddingX="lg" gap="lg" className="pt-2">
                <ReportPeriodHeader
                  monthYearLabel={monthYearLabel}
                  windowDays={windowDays}
                  rangeLabel={rangeLabel}
                  onChangePeriod={() => setIsRangeSheetOpen(true)}
                />

                <ReportQuestionsCard />

                <ReportCoverageCard
                  documentedDays={frequencySummary.documentedDays}
                  windowDays={frequencySummary.windowDays}
                  emptyDays={frequencySummary.emptyDays}
                  symptomFreeDays={0}
                  backfilledCount={0}
                  backfilledAfterOneDay={0}
                  backfilledAfterFourDays={0}
                />

                <CourseCooccurrenceCard
                  summary={cooccurrenceSummary}
                  selectedRowId={selectedRowId}
                  highlightedDateKeys={highlightedDateKeys}
                  onPressRow={handlePressRow}
                  onPressTile={handlePressTile}
                />
              </Box>
            </ScrollView>
          </MascotLoadingGate>
        </Box>
      </SafeAreaScreen>

      <ReportDateRangeSheet
        visible={isRangeSheetOpen}
        initialRange={range}
        bounds={bounds}
        onCancel={() => setIsRangeSheetOpen(false)}
        onApply={(next) => {
          applyRange(next);
          setIsRangeSheetOpen(false);
        }}
        onReset={() => {
          resetToDefault();
          setIsRangeSheetOpen(false);
        }}
      />

      <CourseDayDetailSheet
        detail={selectedDetail}
        visible={selectedDetail !== null}
        onClose={() => setSelectedDateKey(null)}
      />

      <CourseRowInsightSheet
        insight={selectedRowInsight}
        visible={selectedRowInsight !== null}
        onClose={() => setSelectedRowId(null)}
      />
    </SynaGradientBackground>
  );
};

export default ReportTabScreen;
