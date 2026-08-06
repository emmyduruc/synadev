import { useCallback, useEffect, useState } from 'react';

import type { DeepeningFieldId } from '@/lib/deepening/deepeningCatalog';
import {
  loadDeepeningEntries,
  saveDeepeningEntries,
} from '@/lib/deepening/deepeningStorage';
import {
  countCompletedDeepeningEntries,
  createEmptyDeepeningEntries,
  type DeepeningEntries,
  type DeepeningFieldValue,
} from '@/lib/deepening/deepeningTypes';

type UseDeepeningEntriesResult = {
  entries: DeepeningEntries;
  isLoading: boolean;
  completedCount: number;
  refresh: () => Promise<void>;
  saveField: (fieldId: DeepeningFieldId, value: DeepeningFieldValue) => Promise<void>;
};

export const useDeepeningEntries = (): UseDeepeningEntriesResult => {
  const [entries, setEntries] = useState<DeepeningEntries>(createEmptyDeepeningEntries);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const next = await loadDeepeningEntries();
    setEntries(next);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const saveField = useCallback(
    async (fieldId: DeepeningFieldId, value: DeepeningFieldValue) => {
      const current = await loadDeepeningEntries();
      const next = { ...current, [fieldId]: value };
      await saveDeepeningEntries(next);
      setEntries(next);
    },
    [],
  );

  const completedCount = countCompletedDeepeningEntries(entries);

  return {
    entries,
    isLoading,
    completedCount,
    refresh,
    saveField,
  };
};
