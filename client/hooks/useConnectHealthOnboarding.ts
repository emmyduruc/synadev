import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { setHealthOnboardingCompleted } from '@/lib/onboarding/healthOnboardingStorage';
import { ROUTES } from '@/lib/routes';

export const useConnectHealthOnboarding = () => {
  const router = useRouter();

  const openHealthPermissions = useCallback(() => {
    router.replace(ROUTES.onboarding.healthPermissions);
  }, [router]);

  const continueWithoutHealthData = useCallback(async () => {
    await setHealthOnboardingCompleted();
    router.replace(ROUTES.onboarding.notifications);
  }, [router]);

  return {
    openHealthPermissions,
    continueWithoutHealthData,
  };
};
