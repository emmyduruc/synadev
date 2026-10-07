import type { Href } from 'expo-router';

import { getCurrentUser } from '@/lib/api';
import { waitForAccessToken } from '@/lib/http/authToken';
import {
  isBioDataComplete,
  loadBioDataForClerkUser,
  saveBioData,
} from '@/lib/profile/bioDataStorage';
import { mapUserToBioData } from '@/lib/profile/mapUserToBioData';
import { ROUTES } from '@/lib/routes';

const USER_FETCH_ATTEMPTS = 3;
const USER_FETCH_RETRY_DELAY_MS = 250;

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const fetchCurrentUserWithRetry = async () => {
  let lastError: unknown;

  for (let attempt = 0; attempt < USER_FETCH_ATTEMPTS; attempt += 1) {
    try {
      return await getCurrentUser();
    } catch (error) {
      lastError = error;

      if (attempt < USER_FETCH_ATTEMPTS - 1) {
        await delay(USER_FETCH_RETRY_DELAY_MS);
      }
    }
  }

  throw lastError;
};

/**
 * Fast local-only routing for returning users. No network.
 * Complete bio cache for this Clerk user → home; otherwise null (caller should network-resolve).
 */
export const resolveCachedPostAuthDestination = async (
  clerkUserId: string | null | undefined,
): Promise<Href | null> => {
  if (!clerkUserId) {
    return null;
  }

  const cached = await loadBioDataForClerkUser(clerkUserId);

  if (isBioDataComplete(cached)) {
    return ROUTES.home;
  }

  return null;
};

/**
 * DB is the source of truth for post-auth routing.
 * Incomplete bio → onboarding (prefilling any fields already in DB).
 * Transient API/auth failures must not force onboarding for returning users
 * when this device already has a complete bio cache for the same Clerk user.
 */
export const resolvePostAuthDestination = async (
  clerkUserId?: string | null,
): Promise<Href> => {
  try {
    const token = await waitForAccessToken();

    if (!token) {
      throw new Error('Access token unavailable after sign-in');
    }

    const user = await fetchCurrentUserWithRetry();
    const bioFromDb = mapUserToBioData(user);
    const ownerClerkId = user.clerkId || clerkUserId || '';

    if (user.isBioComplete) {
      await saveBioData(bioFromDb, ownerClerkId);
      return ROUTES.home;
    }

    // Keep partial DB values so onboarding can prefill names / DOB already stored.
    await saveBioData(bioFromDb, ownerClerkId);
    return ROUTES.onboarding.bioData;
  } catch {
    if (clerkUserId) {
      const cached = await loadBioDataForClerkUser(clerkUserId);

      if (isBioDataComplete(cached)) {
        return ROUTES.home;
      }
    }

    // New accounts (or cleared caches) must start onboarding — never reuse another user's bio.
    return ROUTES.onboarding.bioData;
  }
};
