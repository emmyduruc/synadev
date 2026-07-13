import { useCallback, useEffect, useState } from 'react';

import { loadPeriodDateKeys, savePeriodDateKeys } from '@/lib/period/periodStorage';

export const usePeriodDates = () => {
  const [dateKeys, setDateKeys] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const stored = await loadPeriodDateKeys();
    setDateKeys(new Set(stored));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const persist = useCallback(async (nextDateKeys: ReadonlySet<string>) => {
    const sorted = [...nextDateKeys];
    await savePeriodDateKeys(sorted);
    setDateKeys(new Set(sorted));
  }, []);

  return {
    dateKeys,
    isLoading,
    refresh,
    persist,
    setDateKeys,
  };
};
