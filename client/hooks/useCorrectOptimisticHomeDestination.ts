import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

import { ROUTES } from '@/lib/routes';

type UseCorrectOptimisticHomeDestinationParams = {
  isComplete: boolean;
  isLoading: boolean;
  hasSyncedFromServer: boolean;
};

/**
 * If the user lands on home without a complete bio (e.g. after delete + signup
 * races), send them into post-auth onboarding (bio → connect health).
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

    if (!isComplete) {
      hasCorrectedRef.current = true;
      router.replace(ROUTES.onboarding.bioData);
    }
  }, [hasSyncedFromServer, isComplete, isLoading, router]);
};
