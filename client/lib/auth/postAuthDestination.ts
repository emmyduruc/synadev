import type { Href } from 'expo-router';

import { getCurrentUser } from '@/lib/api';
import { waitForAccessToken } from '@/lib/http/authToken';
import { getHealthOnboardingCompleted } from '@/lib/onboarding/healthOnboardingStorage';
import { getNotificationOnboardingCompleted } from '@/lib/onboarding/notificationOnboardingStorage';
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

const resolveOnboardingHref = async (isBioComplete: boolean): Promise<Href> => {
  if (!isBioComplete) {
    return ROUTES.onboarding.bioData;
  }

  const healthDone = await getHealthOnboardingCompleted();

  if (!healthDone) {
    return ROUTES.onboarding.connectHealth;
  }

  const notificationsDone = await getNotificationOnboardingCompleted();

  if (!notificationsDone) {
    return ROUTES.onboarding.notifications;
  }

  return ROUTES.home;
};

/**
 * Fast local-only routing for returning users. No network.
 */
export const resolveCachedPostAuthDestination = async (
  clerkUserId: string | null | undefined,
): Promise<Href | null> => {
  if (!clerkUserId) {
    return null;
  }

  const cached = await loadBioDataForClerkUser(clerkUserId);

  if (!isBioDataComplete(cached)) {
    return null;
  }

  return resolveOnboardingHref(true);
};

/**
 * Incomplete bio → bio. Then connect-health, then notifications, then home.
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

    await saveBioData(bioFromDb, ownerClerkId);
    return resolveOnboardingHref(user.isBioComplete);
  } catch {
    if (clerkUserId) {
      const cached = await loadBioDataForClerkUser(clerkUserId);
      return resolveOnboardingHref(isBioDataComplete(cached));
    }

    return ROUTES.onboarding.bioData;
  }
};
