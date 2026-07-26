import type { Href } from 'expo-router';

import { getCurrentUser } from '@/lib/api';
import { waitForAccessToken } from '@/lib/http/authToken';
import {
  clearBioData,
  isBioDataComplete,
  loadBioData,
} from '@/lib/profile/bioDataStorage';
import { ROUTES } from '@/lib/routes';

/**
 * DB is the source of truth for post-auth routing.
 * Incomplete bio → onboarding. Transient API/auth failures must not force
 * onboarding or wipe the local cache for returning users.
 */
export const resolvePostAuthDestination = async (): Promise<Href> => {
  try {
    await waitForAccessToken();
    const user = await getCurrentUser();

    if (user.isBioComplete) {
      return ROUTES.home;
    }

    await clearBioData();
    return ROUTES.onboarding.bioData;
  } catch {
    const cached = await loadBioData();

    if (isBioDataComplete(cached)) {
      return ROUTES.home;
    }

    return ROUTES.onboarding.bioData;
  }
};
