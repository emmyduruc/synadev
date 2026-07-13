import { useCallback, useEffect, useState } from 'react';

import {
  loadSymptomLogs,
  saveSymptomLogs,
  type SymptomLogMap,
} from '@/lib/symptoms/symptomLogStorage';

export const useSymptomLog = () => {
  const [logs, setLogs] = useState<SymptomLogMap>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const stored = await loadSymptomLogs();

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

  const persist = useCallback(async (nextLogs: SymptomLogMap) => {
    await saveSymptomLogs(nextLogs);
    setLogs(nextLogs);
  }, []);

  return { logs, isLoading, persist };
};
