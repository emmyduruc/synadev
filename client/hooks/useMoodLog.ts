import { useCallback, useEffect, useState } from 'react';

import { loadMoodLogs, saveMoodLogs, type MoodLogMap } from '@/lib/mood/moodLogStorage';

export const useMoodLog = () => {
  const [logs, setLogs] = useState<MoodLogMap>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const stored = await loadMoodLogs();

      if (isMounted) {
        setLogs(stored);
        setIsLoading(false);
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  const persist = useCallback(async (nextLogs: MoodLogMap) => {
    await saveMoodLogs(nextLogs);
    setLogs(nextLogs);
  }, []);

  return { logs, isLoading, persist };
};
