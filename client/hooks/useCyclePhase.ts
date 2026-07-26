import type { CyclePhaseSnapshotDto } from '@syna/shared-types';
import { useCallback, useEffect, useState } from 'react';

import { usePeriodDates } from '@/hooks/usePeriodDates';
import { getCyclePhase } from '@/lib/api';

export const useCyclePhase = () => {
  const { dateKeys, isLoading: isPeriodLoading } = usePeriodDates();
  const [snapshot, setSnapshot] = useState<CyclePhaseSnapshotDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);

    try {
      const next = await getCyclePhase();
      setSnapshot(next);
    } catch {
      setSnapshot(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPeriodLoading) {
      return;
    }

    void refresh();
  }, [dateKeys, isPeriodLoading, refresh]);

  return {
    snapshot,
    isLoading: isLoading || isPeriodLoading,
    refresh,
  };
};
