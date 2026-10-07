import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

import { getHealthOnboardingCompleted } from '@/lib/onboarding/healthOnboardingStorage';
import { getNotificationOnboardingCompleted } from '@/lib/onboarding/notificationOnboardingStorage';
import { ROUTES } from '@/lib/routes';

type UseCorrectOptimisticHomeDestinationParams = {
  isComplete: boolean;
  isLoading: boolean;
  hasSyncedFromServer: boolean;
};

/**
 * Home is only valid after bio + health + notification onboarding.
 */
export const useCorrectOptimisticHomeDestination = ({
  isComplete,
  isLoading,
  hasSyncedFromServer,
}: UseCorrectOptimisticHomeDestinationParams): void => {
  const router = useRouter();
  const hasCorrectedRef = useRef(false);

  useEffect(() => {
    if (hasCorrectedRef.current || isLoading || !hasSyncedFromServer) {
      return;
    }

    let isActive = true;

    const correct = async () => {
      if (!isComplete) {
        if (!isActive) {
          return;
        }

        hasCorrectedRef.current = true;
        router.replace(ROUTES.onboarding.bioData);
        return;
      }

      const healthDone = await getHealthOnboardingCompleted();

      if (!isActive) {
        return;
      }

      if (!healthDone) {
        hasCorrectedRef.current = true;
        router.replace(ROUTES.onboarding.connectHealth);
        return;
      }

      const notificationsDone = await getNotificationOnboardingCompleted();

      if (!isActive || notificationsDone) {
        return;
      }

      hasCorrectedRef.current = true;
      router.replace(ROUTES.onboarding.notifications);
    };

    void correct();

    return () => {
      isActive = false;
    };
  }, [hasSyncedFromServer, isComplete, isLoading, router]);
};
