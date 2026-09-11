import { useAuth } from '@clerk/expo';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { ConfettiProvider } from '@/components/gamification/ConfettiProvider';
import { RootLayoutNav } from '@/components/layout/RootLayoutNav';
import { MascotLoadingProvider } from '@/components/loading/MascotLoadingProvider';
import { SplashScreen as BrandSplash } from '@/components/screens/SplashScreen';

const SIGNED_IN_SPLASH_DURATION_MS = 1500;

type RootStartupGateProps = {
  fontsLoaded: boolean;
};


export const RootStartupGate = ({ fontsLoaded }: RootStartupGateProps) => {
  const { isLoaded, isSignedIn } = useAuth({ treatPendingAsSignedOut: false });
  const [isBrandSplashDone, setIsBrandSplashDone] = useState(false);

  useEffect(() => {
    if (!fontsLoaded) {
      return;
    }

    void SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    if (!fontsLoaded || !isLoaded) {
      return;
    }

    if (!isSignedIn) {
      setIsBrandSplashDone(true);
      return;
    }

    const timeout = setTimeout(() => {
      setIsBrandSplashDone(true);
    }, SIGNED_IN_SPLASH_DURATION_MS);

    return () => clearTimeout(timeout);
  }, [fontsLoaded, isLoaded, isSignedIn]);

  const showBrandSplash = !fontsLoaded || !isLoaded || !isBrandSplashDone;

  if (showBrandSplash) {
    return <BrandSplash />;
  }

  return (
    <ConfettiProvider>
      <MascotLoadingProvider>
        <RootLayoutNav />
      </MascotLoadingProvider>
    </ConfettiProvider>
  );
};
