import { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';

import { CourseCooccurrenceCard } from '@/components/course/CourseCooccurrenceCard';
import { CourseDayDetailSheet } from '@/components/course/CourseDayDetailSheet';
import { CourseFrequenciesCard } from '@/components/course/CourseFrequenciesCard';
import { CourseInfoCard } from '@/components/course/CourseInfoCard';
import { CoursePeriodHeader } from '@/components/course/CoursePeriodHeader';
import { CourseRowInsightSheet } from '@/components/course/CourseRowInsightSheet';
import { SAFE_AREA_EDGES, SafeAreaScreen } from '@/components/layout/SafeAreaScreen';
import { SynaGradientBackground } from '@/components/layout/SynaGradientBackground';
import { AppHeader, Box } from '@/components/ui';
import { useCourseScreenData } from '@/hooks/useCourseScreenData';
import { useTranslate } from '@/hooks/useTranslate';
import { buildCourseDayDetail } from '@/lib/course/buildCourseDayDetail';
import { buildCourseRowInsight } from '@/lib/course/buildCourseRowInsight';
import type {
  CourseCooccurrenceRow,
  CourseCooccurrenceRowId,
  CourseCooccurrenceTile,
} from '@/lib/course/courseCooccurrence';

const CourseTabScreen = () => {
  const { t } = useTranslate();
  const {
    frequencySummary,
    cooccurrenceSummary,
    symptomLogs,
    periodDateKeys,
    healthRows,
  } = useCourseScreenData();
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<CourseCooccurrenceRowId | null>(null);

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

  const handleClearRowSelection = () => {
    setSelectedRowId(null);
  };

  return (
    <SynaGradientBackground>
      <SafeAreaScreen edges={SAFE_AREA_EDGES.top} style={{ backgroundColor: 'transparent' }}>
        <Box flex={1}>
          <AppHeader title={t('tab_course_title')} showBack={false} />

          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}>
            <Box paddingX="lg" gap="lg" className="pt-2">
              <CoursePeriodHeader
                windowDays={frequencySummary.windowDays}
                documentedDays={frequencySummary.documentedDays}
                emptyDays={frequencySummary.emptyDays}
              />
              <CourseFrequenciesCard rows={frequencySummary.rows} />
              <CourseCooccurrenceCard
                summary={cooccurrenceSummary}
                selectedRowId={selectedRowId}
                highlightedDateKeys={highlightedDateKeys}
                onPressRow={handlePressRow}
                onPressTile={handlePressTile}
              />
              <CourseInfoCard
                titleKey="course_changes_heading"
                bodyKey="course_changes_empty_body"
              />
              <CourseInfoCard
                titleKey="course_history_why_heading"
                bodyKey="course_history_why_body"
              />
            </Box>
          </ScrollView>
        </Box>
      </SafeAreaScreen>

      <CourseDayDetailSheet
        detail={selectedDetail}
        visible={selectedDetail !== null}
        onClose={() => setSelectedDateKey(null)}
      />

      <CourseRowInsightSheet
        insight={selectedRowInsight}
        visible={selectedRowInsight !== null}
        onClose={handleClearRowSelection}
      />
    </SynaGradientBackground>
  );
};

export default CourseTabScreen;
