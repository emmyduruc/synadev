import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView } from 'react-native';

import { CourseCooccurrenceCard } from '@/components/course/CourseCooccurrenceCard';
import { CourseDayDetailSheet } from '@/components/course/CourseDayDetailSheet';
import { CourseRowInsightSheet } from '@/components/course/CourseRowInsightSheet';
import { SAFE_AREA_EDGES, SafeAreaScreen } from '@/components/layout/SafeAreaScreen';
import { SynaGradientBackground } from '@/components/layout/SynaGradientBackground';
import { MascotLoadingGate } from '@/components/loading/MascotLoadingGate';
import { ReportActionsSection } from '@/components/report/ReportActionsSection';
import { ReportBaselineCard } from '@/components/report/ReportBaselineCard';
import { ReportConcernsSheet } from '@/components/report/ReportConcernsSheet';
import { ReportCoverageCard } from '@/components/report/ReportCoverageCard';
import { ReportDateRangeSheet } from '@/components/report/ReportDateRangeSheet';
import { ReportDisclaimerCard } from '@/components/report/ReportDisclaimerCard';
import { ReportDoctorQuestionsSheet } from '@/components/report/ReportDoctorQuestionsSheet';
import { ReportMechanismCard } from '@/components/report/ReportMechanismCard';
import { ReportNightComparisonCard } from '@/components/report/ReportNightComparisonCard';
import { ReportNumbersCard } from '@/components/report/ReportNumbersCard';
import { ReportObservationCard } from '@/components/report/ReportObservationCard';
import {
  ReportPeriodHeader,
  type ReportPeriodNotice,
} from '@/components/report/ReportPeriodHeader';
import { ReportPeriodPresetSheet } from '@/components/report/ReportPeriodPresetSheet';
import { ReportQuestionsCard } from '@/components/report/ReportQuestionsCard';
import { ReportTogetherCard } from '@/components/report/ReportTogetherCard';
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
import { countDocumentedDaysInRange } from '@/lib/report/countDocumentedDaysInRange';
import {
  formatReportPeriodMonthYear,
  formatReportPeriodRangeLabel,
} from '@/lib/report/formatReportPeriod';
import type { ReportConcernId } from '@/lib/report/reportConcerns';
import type { ReportDoctorQuestionId } from '@/lib/report/reportDoctorQuestions';
import {
  REPORT_PERIOD_PRESET,
  type ReportPeriodPresetOptionId,
} from '@/lib/report/reportPeriodPresets';

const ReportTabScreen = () => {
  const { t, language } = useTranslate();
  const [isPresetSheetOpen, setIsPresetSheetOpen] = useState(false);
  const [isCustomRangeSheetOpen, setIsCustomRangeSheetOpen] = useState(false);
  const [isDoctorQuestionsSheetOpen, setIsDoctorQuestionsSheetOpen] = useState(false);
  const [isConcernsSheetOpen, setIsConcernsSheetOpen] = useState(false);
  const [selectedDoctorQuestionIds, setSelectedDoctorQuestionIds] = useState<
    ReportDoctorQuestionId[]
  >([]);
  const [customDoctorQuestions, setCustomDoctorQuestions] = useState<string[]>([]);
  const [selectedConcernIds, setSelectedConcernIds] = useState<ReportConcernId[]>([]);
  const [concernFreeText, setConcernFreeText] = useState('');
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<CourseCooccurrenceRowId | null>(
    null,
  );
  const [periodNotice, setPeriodNotice] = useState<ReportPeriodNotice | null>(null);
  const noticeBaselineRef = useRef<number | null>(null);

  const {
    range,
    bounds,
    windowDays,
    presetId,
    isLoading: isRangeLoading,
    applyRange,
    applyPreset,
    resetToDefault,
  } = useReportDateRange(true);

  const {
    cooccurrenceSummary,
    symptomLogs,
    periodDateKeys,
    healthRows,
    isLoading: isCourseLoading,
  } = useCourseScreenData();

  const documentedDays = useMemo(
    () =>
      countDocumentedDaysInRange(symptomLogs, range.fromDateKey, range.toDateKey),
    [range.fromDateKey, range.toDateKey, symptomLogs],
  );

  const emptyDays = Math.max(0, windowDays - documentedDays);

  const monthYearLabel = useMemo(
    () => formatReportPeriodMonthYear(range.toDateKey, language),
    [language, range.toDateKey],
  );

  const rangeLabel = useMemo(
    () => formatReportPeriodRangeLabel(range.fromDateKey, range.toDateKey),
    [range.fromDateKey, range.toDateKey],
  );

  const selectedPresetOptionId =
    presetId === REPORT_PERIOD_PRESET.custom
      ? null
      : (presetId as ReportPeriodPresetOptionId);

  useEffect(() => {
    const baseline = noticeBaselineRef.current;

    if (baseline === null) {
      return;
    }

    if (documentedDays !== baseline) {
      setPeriodNotice({
        currentDocumentedDays: documentedDays,
        previousDocumentedDays: baseline,
      });
      return;
    }

    if (presetId === REPORT_PERIOD_PRESET.days28) {
      setPeriodNotice(null);
    }
  }, [documentedDays, presetId]);

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

  const handleSelectPreset = (nextPresetId: ReportPeriodPresetOptionId) => {
    noticeBaselineRef.current = documentedDays;
    applyPreset(nextPresetId);
    setIsPresetSheetOpen(false);
  };

  const handleApplyCustomRange = (next: typeof range) => {
    noticeBaselineRef.current = documentedDays;
    applyRange(next);
    setIsCustomRangeSheetOpen(false);
  };

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
                  periodNotice={periodNotice}
                  onChangePeriod={() => setIsPresetSheetOpen(true)}
                />

                <ReportQuestionsCard
                  selectedQuestionIds={selectedDoctorQuestionIds}
                  customQuestions={customDoctorQuestions}
                  selectedConcernIds={selectedConcernIds}
                  concernFreeText={concernFreeText}
                  onPressAddQuestions={() => setIsDoctorQuestionsSheetOpen(true)}
                  onPressAddConcerns={() => setIsConcernsSheetOpen(true)}
                />

                <ReportCoverageCard
                  documentedDays={documentedDays}
                  windowDays={windowDays}
                  emptyDays={emptyDays}
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

                <ReportTogetherCard />

                <ReportMechanismCard />

                <ReportNumbersCard />

                <ReportNightComparisonCard />

                <ReportObservationCard />

                <ReportBaselineCard />

                <ReportDisclaimerCard />

                <ReportActionsSection />
              </Box>
            </ScrollView>
          </MascotLoadingGate>
        </Box>
      </SafeAreaScreen>

      <ReportPeriodPresetSheet
        visible={isPresetSheetOpen}
        selectedPresetId={selectedPresetOptionId}
        onSelectPreset={handleSelectPreset}
        onPressCustom={() => {
          setIsPresetSheetOpen(false);
          setIsCustomRangeSheetOpen(true);
        }}
        onClose={() => setIsPresetSheetOpen(false)}
      />

      <ReportDoctorQuestionsSheet
        visible={isDoctorQuestionsSheetOpen}
        selectedQuestionIds={selectedDoctorQuestionIds}
        customQuestions={customDoctorQuestions}
        onClose={() => setIsDoctorQuestionsSheetOpen(false)}
        onApply={(selection) => {
          setSelectedDoctorQuestionIds([...selection.questionIds]);
          setCustomDoctorQuestions([...selection.customQuestions]);
          setIsDoctorQuestionsSheetOpen(false);
        }}
      />

      <ReportConcernsSheet
        visible={isConcernsSheetOpen}
        selectedConcernIds={selectedConcernIds}
        freeText={concernFreeText}
        onClose={() => setIsConcernsSheetOpen(false)}
        onApply={(selection) => {
          setSelectedConcernIds([...selection.concernIds]);
          setConcernFreeText(selection.freeText);
          setIsConcernsSheetOpen(false);
        }}
      />

      <ReportDateRangeSheet
        visible={isCustomRangeSheetOpen}
        initialRange={range}
        bounds={bounds}
        onCancel={() => setIsCustomRangeSheetOpen(false)}
        onApply={handleApplyCustomRange}
        onReset={() => {
          noticeBaselineRef.current = null;
          resetToDefault();
          setIsCustomRangeSheetOpen(false);
          setPeriodNotice(null);
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
