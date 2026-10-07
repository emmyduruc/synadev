import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';

import { BioDetailsForm } from '@/components/onboarding/BioDetailsForm';
import { useBioData } from '@/hooks/useBioData';
import type { BioData } from '@/lib/profile/bioDataStorage';
import { ROUTES } from '@/lib/routes';

/**
 * Post-register bio details. Only skip when the server confirms a complete bio.
 * Never trust a previous account's SecureStore cache on this device.
 */
const BioDataOnboardingScreen = () => {
  const router = useRouter();
  const { bioData, isLoading, isComplete, hasSyncedFromServer, persist } = useBioData();

  useEffect(() => {
    if (!isLoading && hasSyncedFromServer && isComplete) {
      router.replace(ROUTES.home);
    }
  }, [hasSyncedFromServer, isComplete, isLoading, router]);

  const handleComplete = useCallback(
    async (nextBioData: BioData) => {
      await persist(nextBioData);
      router.replace(ROUTES.onboarding.connectHealth);
    },
    [persist, router],
  );

  if (isLoading || !hasSyncedFromServer || isComplete) {
    return null;
  }

  return <BioDetailsForm initialBioData={bioData} onComplete={handleComplete} />;
};

export default BioDataOnboardingScreen;
