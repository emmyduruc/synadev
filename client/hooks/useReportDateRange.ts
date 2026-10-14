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

const rangesEqual = (a: ReportDateRange, b: ReportDateRange): boolean =>
  a.fromDateKey === b.fromDateKey && a.toDateKey === b.toDateKey;

export const useReportDateRange = (
  isDoctorTab: boolean,
  seed?: ReportDateRangeSeed | null,
  isSeedLoading = false,
): UseReportDateRangeResult => {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const defaultWindowDays = defaultWindowDaysForTab(isDoctorTab);
  const hasAppliedSeedRef = useRef(false);

  const seedPreset = seed?.periodPreset ?? null;
  const seedFromDate = seed?.periodFromDate ?? null;
  const seedToDate = seed?.periodToDate ?? null;
  const hasSeed = Boolean(seed);

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
    if (isSeedLoading || hasAppliedSeedRef.current || !hasSeed) {
      return;
    }

    hasAppliedSeedRef.current = true;

    if (
      seedFromDate &&
      seedToDate &&
      (seedPreset === REPORT_PERIOD_PRESET.custom ||
        seedPreset === REPORT_PERIOD_PRESET.sinceStart)
    ) {
      setRange(
        clampReportDateRange(
          {
            fromDateKey: seedFromDate,
            toDateKey: seedToDate,
          },
          bounds,
        ),
      );
      setIsCustom(true);
      return;
    }

    if (seedPreset && seedPreset !== REPORT_PERIOD_PRESET.custom) {
      const next = clampReportDateRange(
        buildRangeForPreset(seedPreset, bounds),
        bounds,
      );
      setRange(next);
      setIsCustom(seedPreset !== REPORT_PERIOD_PRESET.days28);
      return;
    }

    if (seedFromDate && seedToDate) {
      setRange(
        clampReportDateRange(
          {
            fromDateKey: seedFromDate,
            toDateKey: seedToDate,
          },
          bounds,
        ),
      );
      setIsCustom(true);
    }
  }, [
    bounds,
    hasSeed,
    isSeedLoading,
    seedFromDate,
    seedPreset,
    seedToDate,
  ]);

  useEffect(() => {
    if (isCustom) {
      setRange((current) => {
        const next = clampReportDateRange(current, bounds);
        return rangesEqual(current, next) ? current : next;
      });
      return;
    }

    if (!hasAppliedSeedRef.current) {
      return;
    }

    if (!hasSeed) {
      setRange((current) =>
        rangesEqual(current, defaultRange) ? current : defaultRange,
      );
    }
  }, [bounds, defaultRange, hasSeed, isCustom]);

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
