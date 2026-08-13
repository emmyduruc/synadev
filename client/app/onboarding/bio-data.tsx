import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';

import { BioDataWizard } from '@/components/onboarding/BioDataWizard';
import { useBioData } from '@/hooks/useBioData';
import type { BioData } from '@/lib/profile/bioDataStorage';
import { ROUTES } from '@/lib/routes';

/**
 * Account-creation bio flow. If the DB profile is already complete (e.g. user
 * was mis-routed after a transient auth error), send them home instead.
 * Prefills any fields already stored in Nest so returning users are not re-asked.
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
      router.replace(ROUTES.home);
    },
    [persist, router],
  );

  if (isLoading || isComplete) {
    return null;
  }

  return (
    <BioDataWizard
      initialBioData={bioData}
      skippable={false}
      onComplete={handleComplete}
    />
  );
};

export default BioDataOnboardingScreen;
