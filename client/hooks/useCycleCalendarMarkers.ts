import type { CyclePhaseSnapshotDto } from '@syna/shared-types';
import {
  buildCycleDayMarkers,
  getPrimaryCycleDayMarker,
  type CycleDayMarker,
} from '@syna/shared-utils';
import { useMemo } from 'react';

import { useCyclePhase } from '@/hooks/useCyclePhase';
import { usePeriodDates } from '@/hooks/usePeriodDates';
import { addDaysToKey, toDateKey } from '@/lib/date/dateKeys';

export type UseCycleCalendarMarkersOptions = {
  /** Inclusive range start (YYYY-MM-DD). Defaults to 60 days ago. */
  fromDateKey?: string;
  /** Inclusive range end (YYYY-MM-DD). Defaults to 60 days ahead. */
  toDateKey?: string;
};

export const useCycleCalendarMarkers = (
  options: UseCycleCalendarMarkersOptions = {},
) => {
  const { snapshot, isLoading: isPhaseLoading, refresh: refreshPhase } = useCyclePhase();
  const { dateKeys, isLoading: isPeriodLoading, refresh: refreshPeriod } = usePeriodDates();

  const todayKey = toDateKey(new Date());
  const fromDateKey = options.fromDateKey ?? addDaysToKey(todayKey, -60);
  const rangeToDateKey = options.toDateKey ?? addDaysToKey(todayKey, 60);

  const markersByDate = useMemo(() => {
    if (!snapshot) {
      return new Map<string, readonly CycleDayMarker[]>();
    }

    return buildCycleDayMarkers({
      periodDateKeys: [...dateKeys],
      snapshot,
      fromDateKey,
      toDateKey: rangeToDateKey,
    });
  }, [dateKeys, fromDateKey, rangeToDateKey, snapshot]);

  const getMarkers = (dateKey: string): readonly CycleDayMarker[] =>
    markersByDate.get(dateKey) ?? [];

  const getPrimaryMarker = (dateKey: string): CycleDayMarker | null =>
    getPrimaryCycleDayMarker(getMarkers(dateKey));

  return {
    snapshot: snapshot as CyclePhaseSnapshotDto | null,
    markersByDate,
    getMarkers,
    getPrimaryMarker,
    isLoading: isPhaseLoading || isPeriodLoading,
    refresh: async () => {
      await Promise.all([refreshPhase(), refreshPeriod()]);
    },
  };
};
