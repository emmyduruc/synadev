import type { CyclePhaseSnapshotDto } from '@syna/shared-types';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { getCyclePhase } from '@/lib/api';
import { subscribePeriodDatesChanged } from '@/lib/period/periodDatesEvents';

/**
 * Loads cycle phase from the API.
 * Refetches on screen focus and whenever period days are saved elsewhere
 * (calendar / record-period modals do not always blur the dashboard).
 */
export const useCyclePhase = () => {
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

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  useEffect(() => subscribePeriodDatesChanged(() => {
    void refresh();
  }), [refresh]);

  return {
    snapshot,
    isLoading,
    refresh,
  };
};
