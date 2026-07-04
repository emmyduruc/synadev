import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { SlideInUp, SlideOutUp } from 'react-native-reanimated';

import { Toaster } from '@/lib/sonner';
import { COLOR_SCHEME } from '@/lib/ui';

const stackScreenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: 'transparent' },
} as const;

export const RootLayoutNav = () => {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === COLOR_SCHEME.dark ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={stackScreenOptions}>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="register" />
        <Stack.Screen name="login" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="(tabs)" />
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
