import { useEffect, useState } from 'react';
import { Keyboard, Platform, type KeyboardEvent } from 'react-native';

const readKeyboardHeight = (event: KeyboardEvent): number =>
  Math.max(0, event.endCoordinates.height);

export type UseKeyboardInsetOptions = {
  /**
   * Height already reserved below the screen content (e.g. tab bar).
   * Keyboard events report height from the window bottom, so subtract this
   * when lifting views that already sit above that chrome.
   */
  subtractBottom?: number;
};

/**
 * Returns the keyboard overlap height to apply as bottom padding/margin.
 * Used to lift sticky footers above the software keyboard on iOS and Android.
 */
export const useKeyboardInset = (options?: UseKeyboardInsetOptions): number => {
  const [inset, setInset] = useState(0);
  const subtractBottom = options?.subtractBottom ?? 0;

  useEffect(() => {
    const onShow = (event: KeyboardEvent) => {
      setInset(readKeyboardHeight(event));
    };

    const onHide = () => {
      setInset(0);
    };

    // iOS: Will* fires before the animation so the footer tracks smoothly.
    // Android: Did* is the reliable pair (Will* is often a no-op).
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, onShow);
    const hideSubscription = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  if (inset <= 0) {
    return 0;
  }

  return Math.max(0, inset - subtractBottom);
};
