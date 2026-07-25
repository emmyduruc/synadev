import type { Href } from 'expo-router';

import { getCurrentUser } from '@/lib/api';
import { clearBioData } from '@/lib/profile/bioDataStorage';
import { ROUTES } from '@/lib/routes';

/**
 * DB is the only source of truth for post-auth routing.
 * Missing user / incomplete bio → bio onboarding from the start (never SecureStore).
 */
export const resolvePostAuthDestination = async (): Promise<Href> => {
  try {
    const user = await getCurrentUser();

    if (user.isBioComplete) {
      return ROUTES.home;
    }

    await clearBioData();
    return ROUTES.onboarding.bioData;
  } catch {
    await clearBioData();
    return ROUTES.onboarding.bioData;
  }
};
