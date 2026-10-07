import type { ReportPeriodPresetId as SharedReportPeriodPresetId } from '@syna/shared-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import {
  buildDefaultReportRange,
  clampReportDateRange,
  countInclusiveDays,
  defaultWindowDaysForTab,
  type ReportDateRange,
  type ReportDateRangeBounds,
  resolveReportBounds,
} from '@/lib/report/reportDateRange';
import {
  REPORT_PERIOD_PRESET,
  buildRangeForPreset,
  resolvePresetFromRange,
  type ReportPeriodPresetId,
  type ReportPeriodPresetOptionId,
} from '@/lib/report/reportPeriodPresets';

export type ReportDateRangeSeed = {
  periodPreset: SharedReportPeriodPresetId | null;
  periodFromDate: string | null;
  periodToDate: string | null;
};

export type UseReportDateRangeResult = {
  range: ReportDateRange;
  bounds: ReportDateRangeBounds;
  windowDays: number;
  presetId: ReportPeriodPresetId;
  isLoading: boolean;
  isCustom: boolean;
  applyRange: (next: ReportDateRange) => void;
  applyPreset: (presetId: ReportPeriodPresetOptionId) => void;
  resetToDefault: () => void;
};

export const useReportDateRange = (
  isDoctorTab: boolean,
  seed?: ReportDateRangeSeed | null,
  isSeedLoading = false,
): UseReportDateRangeResult => {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const defaultWindowDays = defaultWindowDaysForTab(isDoctorTab);
  const hasAppliedSeedRef = useRef(false);

  const bounds = useMemo(
    () => resolveReportBounds(user?.createdAt),
    [user?.createdAt],
  );

  const defaultRange = useMemo(
    () => buildDefaultReportRange(bounds, defaultWindowDays),
    [bounds, defaultWindowDays],
  );

  const [range, setRange] = useState<ReportDateRange>(defaultRange);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    if (isSeedLoading || hasAppliedSeedRef.current || !seed) {
      return;
    }

    hasAppliedSeedRef.current = true;

    if (
      seed.periodFromDate &&
      seed.periodToDate &&
      (seed.periodPreset === REPORT_PERIOD_PRESET.custom ||
        seed.periodPreset === REPORT_PERIOD_PRESET.sinceStart)
    ) {
      setRange(
        clampReportDateRange(
          {
            fromDateKey: seed.periodFromDate,
            toDateKey: seed.periodToDate,
          },
          bounds,
        ),
      );
      setIsCustom(true);
      return;
    }

    if (
      seed.periodPreset &&
      seed.periodPreset !== REPORT_PERIOD_PRESET.custom
    ) {
      const next = clampReportDateRange(
        buildRangeForPreset(seed.periodPreset, bounds),
        bounds,
      );
      setRange(next);
      setIsCustom(seed.periodPreset !== REPORT_PERIOD_PRESET.days28);
      return;
    }

    if (seed.periodFromDate && seed.periodToDate) {
      setRange(
        clampReportDateRange(
          {
            fromDateKey: seed.periodFromDate,
            toDateKey: seed.periodToDate,
          },
          bounds,
        ),
      );
      setIsCustom(true);
    }
  }, [bounds, isSeedLoading, seed]);

  useEffect(() => {
    if (isCustom || !hasAppliedSeedRef.current) {
      if (isCustom) {
        setRange((current) => clampReportDateRange(current, bounds));
      }
      return;
    }

    if (!seed) {
      setRange(defaultRange);
    }
  }, [bounds, defaultRange, isCustom, seed]);

  const applyRange = useCallback(
    (next: ReportDateRange) => {
      setRange(clampReportDateRange(next, bounds));
      setIsCustom(true);
    },
    [bounds],
  );

  const applyPreset = useCallback(
    (presetId: ReportPeriodPresetOptionId) => {
      const next = clampReportDateRange(buildRangeForPreset(presetId, bounds), bounds);
      setRange(next);
      setIsCustom(presetId !== REPORT_PERIOD_PRESET.days28);
    },
    [bounds],
  );

  const resetToDefault = useCallback(() => {
    setIsCustom(false);
    setRange(defaultRange);
  }, [defaultRange]);

  const presetId = useMemo(
    () => resolvePresetFromRange(range, bounds),
    [bounds, range],
  );

  return {
    range,
    bounds,
    windowDays: countInclusiveDays(range.fromDateKey, range.toDateKey),
    presetId,
    isLoading: isUserLoading || isSeedLoading,
    isCustom,
    applyRange,
    applyPreset,
    resetToDefault,
  };
};
