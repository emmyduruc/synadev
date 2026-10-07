import { useAuth } from '@clerk/expo';
import type { UpdateUserProfile } from '@syna/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

import { getCurrentUser, updateCurrentUserProfile } from '@/lib/api';
import type { BioData } from '@/lib/profile/bioDataStorage';
import {
  EMPTY_BIO_DATA,
  getBioDataCompletionPercent,
  isBioDataComplete,
  loadBioDataForClerkUser,
  saveBioData,
} from '@/lib/profile/bioDataStorage';
import { mapUserToBioData } from '@/lib/profile/mapUserToBioData';
import { queryKeys } from '@/lib/query/queryKeys';

const toUpdatePayload = (bioData: BioData): UpdateUserProfile => ({
  firstName: bioData.firstName.trim(),
  lastName: bioData.lastName.trim(),
  dateOfBirth: bioData.dateOfBirth,
  ...(bioData.address.trim() ? { address: bioData.address.trim() } : {}),
});

const syncLocalCacheFromDb = async (
  bioData: BioData,
  ownerClerkId: string,
): Promise<void> => {
  // Always mirror DB into SecureStore so incomplete profiles still prefill onboarding.
  await saveBioData(bioData, ownerClerkId);
};

const isEmptyBioData = (bioData: BioData): boolean =>
  !bioData.firstName.trim()
  && !bioData.lastName.trim()
  && !bioData.dateOfBirth
  && !bioData.address.trim();

/**
 * Profile bio — Postgres is source of truth; SecureStore is a write-through cache
 * scoped to the signed-in Clerk user so a new account never inherits a prior bio.
 */
export const useBioData = () => {
  const { userId: clerkUserId } = useAuth({ treatPendingAsSignedOut: false });
  const queryClient = useQueryClient();
  const [bioData, setBioData] = useState<BioData>(EMPTY_BIO_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSyncedFromServer, setHasSyncedFromServer] = useState(false);
  const [wasCompleteOnHydrate, setWasCompleteOnHydrate] = useState(false);

  const refresh = useCallback(async () => {
    if (!clerkUserId) {
      setBioData(EMPTY_BIO_DATA);
      setHasSyncedFromServer(false);
      setIsLoading(false);
      return;
    }

    try {
      const user = await getCurrentUser();
      queryClient.setQueryData(queryKeys.users.me(), user);
      const next = mapUserToBioData(user);
      await syncLocalCacheFromDb(next, user.clerkId || clerkUserId);
      setBioData(next);
    } catch {
      // Keep local cache on transient API failures — do not wipe returning users.
      const cached = await loadBioDataForClerkUser(clerkUserId);
      setBioData(cached);
    } finally {
      setHasSyncedFromServer(true);
      setIsLoading(false);
    }
  }, [clerkUserId, queryClient]);

  useEffect(() => {
    let isActive = true;

    const hydrate = async () => {
      setHasSyncedFromServer(false);
      setWasCompleteOnHydrate(false);
      setIsLoading(true);

      if (!clerkUserId) {
        if (isActive) {
          setBioData(EMPTY_BIO_DATA);
          setIsLoading(false);
        }
        return;
      }

      const cached = await loadBioDataForClerkUser(clerkUserId);

      if (!isActive) {
        return;
      }

      if (!isEmptyBioData(cached)) {
        setWasCompleteOnHydrate(isBioDataComplete(cached));
        setBioData(cached);
        setIsLoading(false);
      } else {
        setBioData(EMPTY_BIO_DATA);
      }

      await refresh();
    };

    void hydrate();

    return () => {
      isActive = false;
    };
  }, [clerkUserId, refresh]);

  const persist = useCallback(async (nextBioData: BioData) => {
    if (!clerkUserId) {
      throw new Error('Cannot persist bio without a signed-in Clerk user');
    }

    const updatedUser = await updateCurrentUserProfile(toUpdatePayload(nextBioData));
    queryClient.setQueryData(queryKeys.users.me(), updatedUser);
    const synced = mapUserToBioData(updatedUser);
    await syncLocalCacheFromDb(synced, updatedUser.clerkId || clerkUserId);
    setBioData(synced);
    setHasSyncedFromServer(true);
  }, [clerkUserId, queryClient]);

  const percent = getBioDataCompletionPercent(bioData);
  const isComplete = isBioDataComplete(bioData);

  return {
    bioData,
    percent,
    isComplete,
    isLoading,
    hasSyncedFromServer,
    wasCompleteOnHydrate,
    refresh,
    persist,
  };
};
