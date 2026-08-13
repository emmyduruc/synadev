import type { Href } from 'expo-router';

import { getCurrentUser } from '@/lib/api';
import { waitForAccessToken } from '@/lib/http/authToken';
import {
  isBioDataComplete,
  loadBioData,
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
 * DB is the source of truth for post-auth routing.
 * Incomplete bio → onboarding (prefilling any fields already in DB).
 * Transient API/auth failures must not force onboarding for returning users.
 */
export const resolvePostAuthDestination = async (): Promise<Href> => {
  try {
    const token = await waitForAccessToken();

    if (!token) {
      throw new Error('Access token unavailable after sign-in');
    }

    const user = await fetchCurrentUserWithRetry();
    const bioFromDb = mapUserToBioData(user);

    if (user.isBioComplete) {
      await saveBioData(bioFromDb);
      return ROUTES.home;
    }

    // Keep partial DB values so onboarding can prefill names / DOB already stored.
    await saveBioData(bioFromDb);
    return ROUTES.onboarding.bioData;
  } catch {
    const cached = await loadBioData();

    if (isBioDataComplete(cached)) {
      return ROUTES.home;
    }

    return ROUTES.onboarding.bioData;
  }
};
