import type { UpdateUserProfile } from '@syna/shared-types';
import { useCallback, useEffect, useState } from 'react';

import { getCurrentUser, updateCurrentUserProfile } from '@/lib/api';
import type { BioData } from '@/lib/profile/bioDataStorage';
import {
  EMPTY_BIO_DATA,
  getBioDataCompletionPercent,
  isBioDataComplete,
  loadBioData,
  saveBioData,
} from '@/lib/profile/bioDataStorage';
import { mapUserToBioData } from '@/lib/profile/mapUserToBioData';

const toUpdatePayload = (bioData: BioData): UpdateUserProfile => ({
  firstName: bioData.firstName.trim(),
  lastName: bioData.lastName.trim(),
  dateOfBirth: bioData.dateOfBirth,
  ...(bioData.address.trim() ? { address: bioData.address.trim() } : {}),
});

const syncLocalCacheFromDb = async (bioData: BioData): Promise<void> => {
  // Always mirror DB into SecureStore so incomplete profiles still prefill onboarding.
  await saveBioData(bioData);
};

/**
 * Profile bio — Postgres is source of truth; SecureStore is a write-through cache only.
 */
export const useBioData = () => {
  const [bioData, setBioData] = useState<BioData>(EMPTY_BIO_DATA);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);

    try {
      const user = await getCurrentUser();
      const next = mapUserToBioData(user);
      await syncLocalCacheFromDb(next);
      setBioData(next);
    } catch {
      // Keep local cache on transient API failures — do not wipe returning users.
      const cached = await loadBioData();
      setBioData(cached);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const persist = useCallback(async (nextBioData: BioData) => {
    const updatedUser = await updateCurrentUserProfile(toUpdatePayload(nextBioData));
    const synced = mapUserToBioData(updatedUser);
    await syncLocalCacheFromDb(synced);
    setBioData(synced);
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
