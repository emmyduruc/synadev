import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { SlideInUp, SlideOutUp } from 'react-native-reanimated';

import { Toaster } from '@/lib/sonner';
import { COLOR_SCHEME } from '@/lib/ui';

export const RootLayoutNav = () => {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === COLOR_SCHEME.dark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
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
