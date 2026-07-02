import '../global.css';

import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SlideInUp, SlideOutUp } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SplashScreen as BrandSplash } from '@/components/screens/SplashScreen';
import { useColorScheme } from '@/components/useColorScheme';
import { Toaster } from '@/lib/sonner';

const SPLASH_DURATION_MS = 1500;

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

void SplashScreen.preventAutoHideAsync();

const RootLayoutNav = () => {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <Toaster
        position="top-center"
        swipeToDismissDirection="up"
        closeButton
        richColors
        animation={{
          enter: SlideInUp.duration(280),
          exit: SlideOutUp.duration(220),
        }}
        toastOptions={{
          style: {
            borderRadius: 12,
          },
        }}
      />
    </ThemeProvider>
  );
};

const RootLayout = () => {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
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
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        {isSplashVisible ? <BrandSplash /> : <RootLayoutNav />}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
