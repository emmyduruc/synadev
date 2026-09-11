import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

import { ROUTES } from '@/lib/routes';

type UseCorrectOptimisticHomeDestinationParams = {
  isComplete: boolean;
  isLoading: boolean;
  hasSyncedFromServer: boolean;
  wasCompleteOnHydrate: boolean;
};

/**
 * If cold start routed home from a complete SecureStore cache, but the server
 * later says bio is incomplete, send the user to onboarding.
 */
export const useCorrectOptimisticHomeDestination = ({
  isComplete,
  isLoading,
  hasSyncedFromServer,
  wasCompleteOnHydrate,
}: UseCorrectOptimisticHomeDestinationParams): void => {
  const router = useRouter();
  const hasCorrectedRef = useRef(false);

  useEffect(() => {
    if (hasCorrectedRef.current || isLoading || !hasSyncedFromServer) {
      return;
    }

    if (wasCompleteOnHydrate && !isComplete) {
      hasCorrectedRef.current = true;
      router.replace(ROUTES.onboarding.bioData);
    }
  }, [
    hasSyncedFromServer,
    isComplete,
    isLoading,
    router,
    wasCompleteOnHydrate,
  ]);
};
