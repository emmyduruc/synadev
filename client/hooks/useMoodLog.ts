import { useCallback, useEffect, useState } from 'react';

import { getMoodLogs, replaceMoodLogs } from '@/lib/api';
import type { MoodLogMap } from '@/lib/mood/moodLogStorage';

export const useMoodLog = () => {
  const [logs, setLogs] = useState<MoodLogMap>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const { logs: stored } = await getMoodLogs();

        if (isMounted) {
          setLogs(stored);
        }
      } catch {
        if (isMounted) {
          setLogs({});
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  const persist = useCallback(async (nextLogs: MoodLogMap) => {
    const { logs: saved } = await replaceMoodLogs({ logs: nextLogs });
    setLogs(saved);
  }, []);

  return { logs, isLoading, persist };
};
