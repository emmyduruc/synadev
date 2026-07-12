import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { ROUTES } from '@/lib/routes';

export const useOpenBioDataWizard = () => {
  const router = useRouter();

  return useCallback(() => {
    router.push(ROUTES.onboarding.bioData);
  }, [router]);
};
