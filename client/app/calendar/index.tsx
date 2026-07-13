import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CalendarEditPeriodFooter } from '@/components/calendar/CalendarEditPeriodFooter';
import { CalendarMonthView } from '@/components/calendar/CalendarMonthView';
import { CalendarViewToggle } from '@/components/calendar/CalendarViewToggle';
import { CalendarYearPlaceholder } from '@/components/calendar/CalendarYearPlaceholder';
import { useConfettiCelebration } from '@/components/gamification/ConfettiProvider';
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
  const hasScrolledToCurrentMonth = useRef(false);
  const [activeView, setActiveView] = useState<CalendarView>(CALENDAR_VIEW.month);
  const [monthOffsets, setMonthOffsets] = useState<Record<number, number>>({});
  const [draftDateKeys, setDraftDateKeys] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  const isEditPeriodMode = mode === CALENDAR_MODE.editPeriod;
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();
  const months = useMemo(() => buildYearMonths(currentYear), [currentYear]);
  const { dateKeys, isLoading, persist } = usePeriodDates();

  useEffect(() => {
    if (!isEditPeriodMode || isLoading) {
      return;
    }

    setDraftDateKeys(new Set(dateKeys));
  }, [dateKeys, isEditPeriodMode, isLoading]);

  const handleMonthLayout = useCallback((monthIndex: number, y: number) => {
    setMonthOffsets((previous) => {
      if (previous[monthIndex] === y) {
        return previous;
      }

      return { ...previous, [monthIndex]: y };
    });
  }, []);

  useEffect(() => {
    if (!isEditPeriodMode || hasScrolledToCurrentMonth.current) {
      return;
    }

    const offset = monthOffsets[currentMonthIndex];

    if (offset === undefined) {
      return;
    }

    hasScrolledToCurrentMonth.current = true;

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: offset, animated: false });
    });
  }, [currentMonthIndex, isEditPeriodMode, monthOffsets]);

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
          contentContainerStyle={{ paddingBottom: isEditPeriodMode ? 16 : 32 }}>
          <Box paddingX="lg">
            {!isEditPeriodMode && activeView === CALENDAR_VIEW.year ? (
              <CalendarYearPlaceholder />
            ) : (
              <CalendarMonthView
                months={months}
                selectedDateKeys={isEditPeriodMode ? draftDateKeys : dateKeys}
                onToggleDate={isEditPeriodMode ? handleToggleDate : undefined}
                onMonthLayout={isEditPeriodMode ? handleMonthLayout : undefined}
              />
            )}
          </Box>
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
    </Box>
  );
};

export default CalendarScreen;
