import { getPrimaryCycleDayMarker, type CycleDayMarker } from '@syna/shared-utils';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  InteractionManager,
  type ListRenderItemInfo,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CalendarDaySummarySheet } from '@/components/calendar/CalendarDaySummarySheet';
import { CalendarEditPeriodFooter } from '@/components/calendar/CalendarEditPeriodFooter';
import { CalendarMonthView } from '@/components/calendar/CalendarMonthView';
import { CalendarViewToggle } from '@/components/calendar/CalendarViewToggle';
import { CalendarYearPlaceholder } from '@/components/calendar/CalendarYearPlaceholder';
import { useConfettiCelebration } from '@/components/gamification/ConfettiProvider';
import { Box } from '@/components/ui/Box';
import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useCycleCalendarMarkers } from '@/hooks/useCycleCalendarMarkers';
import { useHealthDailyMetrics } from '@/hooks/useHealthDailyMetrics';
import { useMoodLog } from '@/hooks/useMoodLog';
import { usePeriodDates } from '@/hooks/usePeriodDates';
import { useSymptomLog } from '@/hooks/useSymptomLog';
import { useTranslate } from '@/hooks/useTranslate';
import { buildCalendarDaySummary } from '@/lib/calendar/buildCalendarDaySummary';
import {
  buildYearMonths,
  CALENDAR_VIEW,
  type CalendarMonth,
  type CalendarView,
} from '@/lib/dashboard/calendarUtils';
import { DASHBOARD_ICON_WELL } from '@/lib/dashboard/surfaces';
import { CONFETTI_ACTION } from '@/lib/gamification/confettiActions';
import { CALENDAR_MODE } from '@/lib/period/constants';
import { toggleDateKey } from '@/lib/period/periodStorage';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/ui';

const CalendarScreen = () => {
  const router = useRouter();
  const { t } = useTranslate();
  const { celebrate } = useConfettiCelebration();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets();
  const [activeView, setActiveView] = useState<CalendarView>(CALENDAR_VIEW.month);
  const [draftDateKeys, setDraftDateKeys] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [selectedSummaryDateKey, setSelectedSummaryDateKey] = useState<string | null>(
    null,
  );
  const [includeEarlierMonths, setIncludeEarlierMonths] = useState(false);

  const isEditPeriodMode = mode === CALENDAR_MODE.editPeriod;
  const isDaySummaryOpen = selectedSummaryDateKey !== null;
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();
  const months = useMemo(() => buildYearMonths(currentYear), [currentYear]);
  const visibleMonths = useMemo(() => {
    if (includeEarlierMonths) {
      return months;
    }

    return months.slice(currentMonthIndex);
  }, [currentMonthIndex, includeEarlierMonths, months]);
  const { dateKeys, isLoading, persist } = usePeriodDates();
  const { logs: symptomLogs } = useSymptomLog({
    enabled: isDaySummaryOpen,
    refetchOnFocus: false,
  });
  const { logs: moodLogs } = useMoodLog({
    enabled: isDaySummaryOpen,
    refetchOnFocus: false,
  });
  const yearFromKey = `${currentYear}-01-01`;
  const yearToKey = `${currentYear}-12-31`;
  const { rows: healthRows } = useHealthDailyMetrics({
    query: {
      from: selectedSummaryDateKey ?? yearFromKey,
      to: selectedSummaryDateKey ?? yearToKey,
    },
    enabled: isDaySummaryOpen,
    refetchOnFocus: false,
  });
  const { markersByDate } = useCycleCalendarMarkers({
    fromDateKey: yearFromKey,
    toDateKey: yearToKey,
  });
  const markerByDateKey = useMemo(() => {
    const map = new Map<string, CycleDayMarker | null>();

    markersByDate.forEach((markers, dateKey) => {
      map.set(dateKey, getPrimaryCycleDayMarker(markers));
    });

    return map;
  }, [markersByDate]);
  const selectedDaySummary = useMemo(() => {
    if (!selectedSummaryDateKey) {
      return null;
    }

    return buildCalendarDaySummary({
      dateKey: selectedSummaryDateKey,
      symptomLogs,
      moodLogs,
      healthRows,
      periodDateKeys: dateKeys,
      cycleMarker: markerByDateKey.get(selectedSummaryDateKey) ?? null,
    });
  }, [
    dateKeys,
    healthRows,
    markerByDateKey,
    moodLogs,
    selectedSummaryDateKey,
    symptomLogs,
  ]);
  const showMonthGrid = isEditPeriodMode || activeView === CALENDAR_VIEW.month;

  useEffect(() => {
    if (!isEditPeriodMode || isLoading) {
      return;
    }

    setDraftDateKeys(new Set(dateKeys));
  }, [dateKeys, isEditPeriodMode, isLoading]);

  useEffect(() => {
    if (includeEarlierMonths || !showMonthGrid) {
      return undefined;
    }

    const task = InteractionManager.runAfterInteractions(() => {
      setIncludeEarlierMonths(true);
    });

    return () => {
      task.cancel();
    };
  }, [includeEarlierMonths, showMonthGrid]);

  const handleToggleDate = useCallback((dateKey: string) => {
    setDraftDateKeys((previous) => toggleDateKey(previous, dateKey));
  }, []);

  const handlePressDate = useCallback((dateKey: string) => {
    setSelectedSummaryDateKey(dateKey);
  }, []);

  const handleCloseSummary = useCallback(() => {
    setSelectedSummaryDateKey(null);
  }, []);

  const handleEditSummary = useCallback(
    (dateKey: string) => {
      setSelectedSummaryDateKey(null);
      router.push({
        pathname: ROUTES.symptoms,
        params: { dateKey },
      });
    },
    [router],
  );

  const handleCancel = useCallback(() => {
    if (isEditPeriodMode) {
      setDraftDateKeys(new Set(dateKeys));
    }

    router.back();
  }, [dateKeys, isEditPeriodMode, router]);

  const handleSave = useCallback(async () => {
    if (!isEditPeriodMode || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      await persist(draftDateKeys);
      celebrate(CONFETTI_ACTION.periodLogged);
      router.back();
    } finally {
      setIsSaving(false);
    }
  }, [celebrate, draftDateKeys, isEditPeriodMode, isSaving, persist, router]);

  const renderMonth = useCallback(
    ({ item }: ListRenderItemInfo<CalendarMonth>) => (
      <View className="px-6 pb-6">
        <CalendarMonthView
          months={[item]}
          selectedDateKeys={isEditPeriodMode ? draftDateKeys : dateKeys}
          markerByDateKey={isEditPeriodMode ? undefined : markerByDateKey}
          onToggleDate={isEditPeriodMode ? handleToggleDate : undefined}
          onPressDate={isEditPeriodMode ? undefined : handlePressDate}
        />
      </View>
    ),
    [
      dateKeys,
      draftDateKeys,
      handlePressDate,
      handleToggleDate,
      isEditPeriodMode,
      markerByDateKey,
    ],
  );

  const headerTitle = isEditPeriodMode
    ? t('calendar_edit_period_title')
    : t('calendar_screen_title');

  return (
    <Box flex={1} fullWidth background="background">
      <Box flex={1} style={{ paddingTop: safeAreaTop }}>
        <Box direction="row" align="center" justify="between" paddingX="lg" paddingY="sm">
          {!isEditPeriodMode ? (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={t('calendar_close_accessibility_label')}
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              onPress={handleCancel}
              className={cn('h-11 w-11', DASHBOARD_ICON_WELL.gem)}>
              <CloseIcon size={22} />
            </TouchableOpacity>
          ) : (
            <Box className="h-11 w-11" />
          )}
          <Text size="lg" weight="bold">
            {headerTitle}
          </Text>
          <Box className="h-11 w-11" />
        </Box>

        {!isEditPeriodMode ? (
          <Box paddingX="lg" className="mb-4">
            <CalendarViewToggle
              activeView={activeView}
              onChange={setActiveView}
              monthLabel={t('calendar_view_month')}
              yearLabel={t('calendar_view_year')}
            />
          </Box>
        ) : null}

        {!isEditPeriodMode && activeView === CALENDAR_VIEW.year ? (
          <Box className="px-6">
            <CalendarYearPlaceholder />
          </Box>
        ) : null}

        {showMonthGrid ? (
          <FlatList
            data={visibleMonths}
            keyExtractor={(month) => `${month.year}-${month.monthIndex}`}
            renderItem={renderMonth}
            showsVerticalScrollIndicator={false}
            initialNumToRender={4}
            maxToRenderPerBatch={3}
            windowSize={7}
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
            }}
            contentContainerStyle={{
              paddingBottom: isEditPeriodMode ? 16 : 32,
            }}
          />
        ) : null}

        {isEditPeriodMode ? (
          <Box style={{ paddingBottom: safeAreaBottom }}>
            <CalendarEditPeriodFooter
              isSaving={isSaving}
              onCancel={handleCancel}
              onSave={() => {
                void handleSave();
              }}
            />
          </Box>
        ) : (
          <Box style={{ height: safeAreaBottom }} />
        )}
      </Box>

      {!isEditPeriodMode ? (
        <CalendarDaySummarySheet
          summary={selectedDaySummary}
          visible={selectedDaySummary !== null}
          onClose={handleCloseSummary}
          onEdit={handleEditSummary}
        />
      ) : null}
    </Box>
  );
};

export default CalendarScreen;
