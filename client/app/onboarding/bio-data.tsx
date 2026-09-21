import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';

import { BioDetailsForm } from '@/components/onboarding/BioDetailsForm';
import { useBioData } from '@/hooks/useBioData';
import type { BioData } from '@/lib/profile/bioDataStorage';
import { ROUTES } from '@/lib/routes';

/**
 * Post-register bio details. If the DB profile is already complete, go home.
 * Prefills any fields already stored so returning users are not re-asked.
 */
const BioDataOnboardingScreen = () => {
  const router = useRouter();
  const { bioData, isLoading, isComplete, persist } = useBioData();

  useEffect(() => {
    if (!isLoading && isComplete) {
      router.replace(ROUTES.home);
    }
  }, [isComplete, isLoading, router]);

  const handleComplete = useCallback(
    async (nextBioData: BioData) => {
      await persist(nextBioData);
      router.replace(ROUTES.onboarding.connectHealth);
    },
    [persist, router],
  );

  if (isLoading || isComplete) {
    return null;
  }

  return <BioDetailsForm initialBioData={bioData} onComplete={handleComplete} />;
};

export default BioDataOnboardingScreen;
