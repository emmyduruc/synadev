import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { ROUTES } from '@/lib/routes';

export const useConnectHealthOnboarding = () => {
  const router = useRouter();

  const goHome = useCallback(() => {
    router.replace(ROUTES.home);
  }, [router]);

  const openHealthPermissions = useCallback(() => {
    router.push(ROUTES.onboarding.healthPermissions);
  }, [router]);

  const continueWithoutHealthData = useCallback(() => {
    goHome();
  }, [goHome]);

  return {
    openHealthPermissions,
    continueWithoutHealthData,
  };
};
