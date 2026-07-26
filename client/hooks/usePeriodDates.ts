import { useCallback, useEffect, useState } from 'react';

import { getPeriodDays, replacePeriodDays } from '@/lib/api';
import { emitPeriodDatesChanged } from '@/lib/period/periodDatesEvents';

export const usePeriodDates = () => {
  const [dateKeys, setDateKeys] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);

    try {
      const { dateKeys: next } = await getPeriodDays();
      setDateKeys(new Set(next));
    } catch {
      setDateKeys(new Set());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const persist = useCallback(async (nextDateKeys: ReadonlySet<string>) => {
    const sorted = [...new Set(nextDateKeys)].sort();
    const { dateKeys: saved } = await replacePeriodDays({ dateKeys: sorted });
    setDateKeys(new Set(saved));
    emitPeriodDatesChanged();
  }, []);

  return {
    dateKeys,
    isLoading,
    refresh,
    persist,
    setDateKeys,
  };
};
