import { useCallback, useEffect, useState } from 'react';

import { getSymptomLogs, replaceSymptomLogs } from '@/lib/api';
import type { SymptomLogMap } from '@/lib/symptoms/symptomLogStorage';

export const useSymptomLog = () => {
  const [logs, setLogs] = useState<SymptomLogMap>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const { logs: stored } = await getSymptomLogs();

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

  const persist = useCallback(async (nextLogs: SymptomLogMap) => {
    const { logs: saved } = await replaceSymptomLogs({ logs: nextLogs });
    setLogs(saved);
  }, []);

  return { logs, isLoading, persist };
};
