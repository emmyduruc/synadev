import '../global.css';

import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ClerkAuthTokenBridge } from '@/components/auth/ClerkAuthTokenBridge';
import { RootStartupGate } from '@/components/layout/RootStartupGate';
import { PushNotificationsBridge } from '@/components/notifications/PushNotificationsBridge';
import { useEasUpdates } from '@/hooks/useEasUpdates';
import { getClerkPublishableKey } from '@/lib/clerk/env';
import { useAppFonts } from '@/lib/fonts/useAppFonts';
import '@/lib/i18n';

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
  useEasUpdates();

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkAuthTokenBridge />
      <PushNotificationsBridge />
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <RootStartupGate fontsLoaded={loaded} />
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
