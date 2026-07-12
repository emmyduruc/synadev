import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { BioDataWizard } from '@/components/onboarding/BioDataWizard';
import { useBioData } from '@/hooks/useBioData';
import type { BioData } from '@/lib/profile/bioDataStorage';
import { EMPTY_BIO_DATA } from '@/lib/profile/bioDataStorage';
import { ROUTES } from '@/lib/routes';

const BioDataOnboardingScreen = () => {
  const router = useRouter();
  const { bioData, isLoading, persist } = useBioData();
  const [initialBioData, setInitialBioData] = useState<BioData>(EMPTY_BIO_DATA);

  useEffect(() => {
    if (!isLoading) {
      setInitialBioData(bioData);
    }
  }, [bioData, isLoading]);

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
      initialBioData={initialBioData}
      skippable={false}
      onComplete={handleComplete}
    />
  );
};

export default BioDataOnboardingScreen;
