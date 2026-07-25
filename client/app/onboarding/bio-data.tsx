import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { BioDataWizard } from '@/components/onboarding/BioDataWizard';
import { useBioData } from '@/hooks/useBioData';
import type { BioData } from '@/lib/profile/bioDataStorage';
import { EMPTY_BIO_DATA } from '@/lib/profile/bioDataStorage';
import { ROUTES } from '@/lib/routes';

/**
 * Account-creation bio flow — always starts from step 1 with empty fields
 * when the user has no complete DB profile (SecureStore is not used as input).
 */
const BioDataOnboardingScreen = () => {
  const router = useRouter();
  const { isLoading, persist } = useBioData();

  const handleComplete = useCallback(
    async (nextBioData: BioData) => {
      await persist(nextBioData);
      router.replace(ROUTES.home);
    },
    [persist, router],
  );

  if (isLoading) {
    return null;
  }

  return (
    <BioDataWizard
      initialBioData={EMPTY_BIO_DATA}
      skippable={false}
      onComplete={handleComplete}
    />
  );
};

export default BioDataOnboardingScreen;
