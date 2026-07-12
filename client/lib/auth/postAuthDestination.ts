import type { Href } from 'expo-router';

import { isBioDataComplete, loadBioData } from '@/lib/profile/bioDataStorage';
import { ROUTES } from '@/lib/routes';

export const resolvePostAuthDestination = async (): Promise<Href> => {
  const bioData = await loadBioData();

  if (isBioDataComplete(bioData)) {
    return ROUTES.home;
  }

  return ROUTES.onboarding.bioData;
};
