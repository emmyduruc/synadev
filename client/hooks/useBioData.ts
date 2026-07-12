import { useCallback, useEffect, useState } from 'react';

import type { BioData } from '@/lib/profile/bioDataStorage';
import {
  EMPTY_BIO_DATA,
  getBioDataCompletionPercent,
  isBioDataComplete,
  loadBioData,
  saveBioData,
} from '@/lib/profile/bioDataStorage';

export const useBioData = () => {
  const [bioData, setBioData] = useState<BioData>(EMPTY_BIO_DATA);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const stored = await loadBioData();
    setBioData(stored);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const persist = useCallback(async (nextBioData: BioData) => {
    await saveBioData(nextBioData);
    setBioData(nextBioData);
  }, []);

  const percent = getBioDataCompletionPercent(bioData);
  const isComplete = isBioDataComplete(bioData);

  return {
    bioData,
    percent,
    isComplete,
    isLoading,
    refresh,
    persist,
  };
};
