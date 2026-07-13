import '../global.css';

import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ConfettiProvider } from '@/components/gamification/ConfettiProvider';
import { RootLayoutNav } from '@/components/layout/RootLayoutNav';
import { MascotLoadingProvider } from '@/components/loading/MascotLoadingProvider';
import { SplashScreen as BrandSplash } from '@/components/screens/SplashScreen';
import { getClerkPublishableKey } from '@/lib/clerk/env';
import { useAppFonts } from '@/lib/fonts/useAppFonts';
import '@/lib/i18n';

const SPLASH_DURATION_MS = 1500;

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

void SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const publishableKey = getClerkPublishableKey();
  const [loaded, error] = useAppFonts();
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync();
      const timeout = setTimeout(() => setIsSplashVisible(false), SPLASH_DURATION_MS);
      return () => clearTimeout(timeout);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          {isSplashVisible ? (
            <BrandSplash />
          ) : (
            <ConfettiProvider>
              <MascotLoadingProvider>
                <RootLayoutNav />
              </MascotLoadingProvider>
            </ConfettiProvider>
          )}
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ClerkProvider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
