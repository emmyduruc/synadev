import { useCallback, useMemo, useState } from 'react';

import { useCycleCalendarMarkers } from '@/hooks/useCycleCalendarMarkers';
import { useHealthDailyMetrics } from '@/hooks/useHealthDailyMetrics';
import { useMoodLog } from '@/hooks/useMoodLog';
import { usePeriodDates } from '@/hooks/usePeriodDates';
import { useSymptomLog } from '@/hooks/useSymptomLog';
import { buildCalendarDaySummary } from '@/lib/calendar/buildCalendarDaySummary';

/**
 * Opens the calendar day summary bottom sheet for a selected date.
 * Fetches symptom / mood / health / period data only while the sheet is open.
 */
export const useCalendarDaySummarySheet = () => {
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const isOpen = selectedDateKey !== null;

  const { dateKeys: periodDateKeys } = usePeriodDates();
  const { logs: symptomLogs } = useSymptomLog({
    enabled: isOpen,
    refetchOnFocus: false,
  });
  const { logs: moodLogs } = useMoodLog({
    enabled: isOpen,
    refetchOnFocus: false,
  });
  const healthDateKey = selectedDateKey ?? '1970-01-01';
  const { rows: healthRows } = useHealthDailyMetrics({
    query: {
      from: healthDateKey,
      to: healthDateKey,
    },
    enabled: isOpen,
    refetchOnFocus: false,
  });
  const { getPrimaryMarker } = useCycleCalendarMarkers(
    selectedDateKey
      ? { fromDateKey: selectedDateKey, toDateKey: selectedDateKey }
      : {},
  );

  const summary = useMemo(() => {
    if (!selectedDateKey) {
      return null;
    }

    return buildCalendarDaySummary({
      dateKey: selectedDateKey,
      symptomLogs,
      moodLogs,
      healthRows,
      periodDateKeys,
      cycleMarker: getPrimaryMarker(selectedDateKey),
    });
  }, [
    getPrimaryMarker,
    healthRows,
    moodLogs,
    periodDateKeys,
    selectedDateKey,
    symptomLogs,
  ]);

  const open = useCallback((dateKey: string) => {
    setSelectedDateKey(dateKey);
  }, []);

  const close = useCallback(() => {
    setSelectedDateKey(null);
  }, []);

  return {
    summary,
    visible: summary !== null,
    open,
    close,
  };
};
