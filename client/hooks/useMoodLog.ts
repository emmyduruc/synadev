import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { getMoodLogs, replaceMoodLogs } from '@/lib/api';
import {
  emitMoodLogsChanged,
  subscribeMoodLogsChanged,
} from '@/lib/mood/moodLogsEvents';
import type { MoodLogMap } from '@/lib/mood/moodLogStorage';

/**
 * Loads mood logs from the API.
 * Refetches on screen focus and whenever logs are saved elsewhere.
 */
export const useMoodLog = () => {
  const [logs, setLogs] = useState<MoodLogMap>({});
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);

    try {
      const { logs: stored } = await getMoodLogs();
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
      subscribeMoodLogsChanged(() => {
        void refresh();
      }),
    [refresh],
  );

  const persist = useCallback(async (nextLogs: MoodLogMap) => {
    const { logs: saved } = await replaceMoodLogs({ logs: nextLogs });
    setLogs(saved);
    emitMoodLogsChanged();
  }, []);

  return { logs, isLoading, persist, refresh };
};
