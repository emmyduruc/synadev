import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { InteractionManager, ScrollView, View, type View as ViewType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CalendarEditPeriodFooter } from '@/components/calendar/CalendarEditPeriodFooter';
import { CalendarMonthView } from '@/components/calendar/CalendarMonthView';
import { CalendarViewToggle } from '@/components/calendar/CalendarViewToggle';
import { CalendarYearPlaceholder } from '@/components/calendar/CalendarYearPlaceholder';
import { useConfettiCelebration } from '@/components/gamification/ConfettiProvider';
import { MascotLoadingGate } from '@/components/loading/MascotLoadingGate';
import { Box } from '@/components/ui/Box';
import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { usePeriodDates } from '@/hooks/usePeriodDates';
import { useTranslate } from '@/hooks/useTranslate';
import {
  buildYearMonths,
  CALENDAR_VIEW,
  type CalendarView,
} from '@/lib/dashboard/calendarUtils';
import { DASHBOARD_ICON_WELL } from '@/lib/dashboard/surfaces';
import { CONFETTI_ACTION } from '@/lib/gamification/confettiActions';
import { LOADING_VARIANT } from '@/lib/loading/loadingVariants';
import { CALENDAR_MODE } from '@/lib/period/constants';
import { toggleDateKey } from '@/lib/period/periodStorage';
import { cn } from '@/lib/ui';

const CalendarScreen = () => {
  const router = useRouter();
  const { t } = useTranslate();
  const { celebrate } = useConfettiCelebration();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const scrollContentRef = useRef<ViewType>(null);
  const scrollTargetRef = useRef<ViewType>(null);
  const hasScrolledToCurrentMonth = useRef(false);
  const [activeView, setActiveView] = useState<CalendarView>(CALENDAR_VIEW.month);
  const [draftDateKeys, setDraftDateKeys] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [isScrollPositioned, setIsScrollPositioned] = useState(false);

  const isEditPeriodMode = mode === CALENDAR_MODE.editPeriod;
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();
  const months = useMemo(() => buildYearMonths(currentYear), [currentYear]);
  const { dateKeys, isLoading, persist } = usePeriodDates();
  const showMonthGrid = isEditPeriodMode || activeView === CALENDAR_VIEW.month;
  const shouldScrollToCurrentMonth = showMonthGrid;
  const isPeriodDataReady = !isEditPeriodMode || !isLoading;
  const isCalendarContentReady = !shouldScrollToCurrentMonth || (isScrollPositioned && isPeriodDataReady);

  useEffect(() => {
    if (!isEditPeriodMode || isLoading) {
      return;
    }

    setDraftDateKeys(new Set(dateKeys));
  }, [dateKeys, isEditPeriodMode, isLoading]);

  useEffect(() => {
    hasScrolledToCurrentMonth.current = false;
    setIsScrollPositioned(!shouldScrollToCurrentMonth);
  }, [shouldScrollToCurrentMonth, currentMonthIndex]);

  const scrollToCurrentMonth = useCallback(() => {
    if (!shouldScrollToCurrentMonth || hasScrolledToCurrentMonth.current) {
      return;
    }

    if (isEditPeriodMode && isLoading) {
      return;
    }

    const target = scrollTargetRef.current;
    const content = scrollContentRef.current;

    if (!target || !content) {
      return;
    }

    target.measureLayout(
      content,
      (_x, y) => {
        hasScrolledToCurrentMonth.current = true;

        InteractionManager.runAfterInteractions(() => {
          requestAnimationFrame(() => {
            scrollRef.current?.scrollTo({ y: Math.max(0, y - 12), animated: false });
            setIsScrollPositioned(true);
          });
        });
      },
      () => {
        // Layout not ready yet — onContentSizeChange / onScrollTargetReady will retry.
      },
    );
  }, [isEditPeriodMode, isLoading, shouldScrollToCurrentMonth]);

  const handleScrollTargetReady = useCallback(() => {
    scrollToCurrentMonth();
  }, [scrollToCurrentMonth]);

  const handleContentSizeChange = useCallback(() => {
    scrollToCurrentMonth();
  }, [scrollToCurrentMonth]);

  useEffect(() => {
    scrollToCurrentMonth();
  }, [scrollToCurrentMonth]);

  const handleToggleDate = useCallback((dateKey: string) => {
    setDraftDateKeys((previous) => toggleDateKey(previous, dateKey));
  }, []);

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

  const headerTitle = isEditPeriodMode
    ? t('calendar_edit_period_title')
    : t('calendar_screen_title');

  return (
    <Box flex={1} fullWidth background="background">
      <MascotLoadingGate
        enabled={shouldScrollToCurrentMonth}
        variant={LOADING_VARIANT.cycleCalendar}
        isReady={isCalendarContentReady}
        className="flex-1">
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

          <ScrollView
            ref={scrollRef}
            className="flex-1"
            showsVerticalScrollIndicator={false}
            onContentSizeChange={handleContentSizeChange}
            contentContainerStyle={{ paddingBottom: isEditPeriodMode ? 16 : 32 }}>
            <View ref={scrollContentRef} className="px-6">
              {!isEditPeriodMode && activeView === CALENDAR_VIEW.year ? (
                <CalendarYearPlaceholder />
              ) : (
                <CalendarMonthView
                  months={months}
                  selectedDateKeys={isEditPeriodMode ? draftDateKeys : dateKeys}
                  onToggleDate={isEditPeriodMode ? handleToggleDate : undefined}
                  scrollTargetMonthIndex={shouldScrollToCurrentMonth ? currentMonthIndex : undefined}
                  scrollTargetRef={scrollTargetRef}
                  onScrollTargetReady={handleScrollTargetReady}
                />
              )}
            </View>
          </ScrollView>

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
      </MascotLoadingGate>
    </Box>
  );
};

export default CalendarScreen;
