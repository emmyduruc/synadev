import { useCallback, useEffect, useMemo, useState } from 'react';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import {
  buildDefaultReportRange,
  clampReportDateRange,
  countInclusiveDays,
  defaultWindowDaysForTab,
  resolveReportBounds,
  type ReportDateRange,
  type ReportDateRangeBounds,
} from '@/lib/report/reportDateRange';

export type UseReportDateRangeResult = {
  range: ReportDateRange;
  bounds: ReportDateRangeBounds;
  windowDays: number;
  isLoading: boolean;
  isCustom: boolean;
  applyRange: (next: ReportDateRange) => void;
  resetToDefault: () => void;
};

export const useReportDateRange = (isDoctorTab: boolean): UseReportDateRangeResult => {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const defaultWindowDays = defaultWindowDaysForTab(isDoctorTab);

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
    if (isCustom) {
      setRange((current) => clampReportDateRange(current, bounds));
      return;
    }

    setRange(defaultRange);
  }, [bounds, defaultRange, isCustom]);

  const applyRange = useCallback(
    (next: ReportDateRange) => {
      setRange(clampReportDateRange(next, bounds));
      setIsCustom(true);
    },
    [bounds],
  );

  const resetToDefault = useCallback(() => {
    setIsCustom(false);
    setRange(defaultRange);
  }, [defaultRange]);

  return {
    range,
    bounds,
    windowDays: countInclusiveDays(range.fromDateKey, range.toDateKey),
    isLoading: isUserLoading,
    isCustom,
    applyRange,
    resetToDefault,
  };
};
