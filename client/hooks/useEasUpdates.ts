import * as Updates from 'expo-updates';
import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

const checkAndFetchUpdate = async (): Promise<void> => {
  if (__DEV__ || !Updates.isEnabled) {
    return;
  }

  try {
    const result = await Updates.checkForUpdateAsync();

    if (!result.isAvailable) {
      return;
    }

    await Updates.fetchUpdateAsync();
  } catch {
    // Offline / Expo service blips should never block the app.
  }
};

/**
 * Downloads EAS Updates on cold start and when the app returns to foreground.
 * The new bundle applies on the next cold start (close + reopen).
 */
export const useEasUpdates = (): void => {
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    void checkAndFetchUpdate();

    const subscription = AppState.addEventListener('change', (nextState) => {
      const wasBackground =
        appStateRef.current === 'background' || appStateRef.current === 'inactive';
      appStateRef.current = nextState;

      if (wasBackground && nextState === 'active') {
        void checkAndFetchUpdate();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
};
