import { useAuth } from '@clerk/expo';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';

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
  const hasMountedNavRef = useRef(false);

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

  // Startup only: Clerk reports `isLoaded: false` again while sign-in finalizes.
  // Unmounting the root Stack then left Android on a blank white screen.
  const showBrandSplash = !hasMountedNavRef.current
    && (!fontsLoaded || !isLoaded || !isBrandSplashDone);

  if (showBrandSplash) {
    return <BrandSplash />;
  }

  hasMountedNavRef.current = true;

  return (
    <ConfettiProvider>
      <MascotLoadingProvider>
        <RootLayoutNav />
      </MascotLoadingProvider>
    </ConfettiProvider>
  );
};
