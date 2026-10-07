import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { SlideInUp, SlideOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Toaster } from '@/lib/sonner';
import { COLOR_SCHEME } from '@/lib/ui';

/** Extra gap below the status bar / notch once safe-area top is applied. */
const TOAST_TOP_GAP = 8;

const stackScreenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: 'transparent' },
} as const;

export const RootLayoutNav = () => {
  const colorScheme = useColorScheme();
  const { top: safeAreaTop } = useSafeAreaInsets();

  return (
    <ThemeProvider value={colorScheme === COLOR_SCHEME.dark ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={stackScreenOptions}>
        <Stack.Screen name="index" />
        <Stack.Screen name="intro" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="register" />
        <Stack.Screen name="login" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="(tabs)" />
        {/* Card (not fullScreenModal): modal presentation made home open as a
            swipeable sheet over connect-health after onboarding finished. */}
        <Stack.Screen
          name="onboarding/bio-data"
          options={{
            gestureEnabled: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="onboarding/connect-health"
          options={{
            gestureEnabled: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="onboarding/health-permissions"
          options={{
            gestureEnabled: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="onboarding/notifications"
          options={{
            gestureEnabled: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="calendar/index"
          options={{
            presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen
          name="cycle-insights/index"
          options={{
            presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen
          name="record-period/index"
          options={{
            presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen
          name="period-ended/index"
          options={{
            presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen
          name="symptoms/index"
          options={{
            presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen
          name="mood/index"
          options={{
            presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen
          name="assessment/mrs-ii"
          options={{
            presentation: 'fullScreenModal',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="assessment/patient-activation-measure"
          options={{
            presentation: 'fullScreenModal',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="assessment/phq-2"
          options={{
            presentation: 'fullScreenModal',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="profile-settings"
          options={{
            presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen
          name="profile-data-sources"
          options={{
            presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen
          name="clinical-profile/index"
          options={{
            presentation: 'fullScreenModal',
          }}
        />
      </Stack>
      <Toaster
        position="top-center"
        swipeToDismissDirection="up"
        closeButton
        richColors
        // sonner-native treats `offset` as the full top inset (it replaces safe area).
        // Always include the device safe-area top so toasts clear the status bar / notch.
        offset={safeAreaTop + TOAST_TOP_GAP}
        animation={{
          enter: SlideInUp.duration(280),
          exit: SlideOutUp.duration(220),
        }}
        toastOptions={{
          style: {
            borderRadius: 12,
          },
          titleStyle: {
            flexShrink: 1,
          },
        }}
      />
    </ThemeProvider>
  );
};
