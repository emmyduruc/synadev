import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { getSymptomLogs, replaceSymptomLogs } from '@/lib/api';
import {
  emitSymptomLogsChanged,
  subscribeSymptomLogsChanged,
} from '@/lib/symptoms/symptomLogsEvents';
import type { SymptomLogMap } from '@/lib/symptoms/symptomLogStorage';

/**
 * Loads symptom logs from the API.
 * Refetches on screen focus and whenever logs are saved elsewhere
 * (e.g. Capture Ready should update Courses immediately).
 */
export const useSymptomLog = () => {
  const [logs, setLogs] = useState<SymptomLogMap>({});
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);

    try {
      const { logs: stored } = await getSymptomLogs();
      setLogs(stored);
    } catch {
      setLogs({});
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  useEffect(
    () =>
      subscribeSymptomLogsChanged(() => {
        void refresh();
      }),
    [refresh],
  );

  const persist = useCallback(async (nextLogs: SymptomLogMap) => {
    const { logs: saved } = await replaceSymptomLogs({ logs: nextLogs });
    setLogs(saved);
    emitSymptomLogsChanged();
  }, []);

  return { logs, isLoading, persist, refresh };
};
