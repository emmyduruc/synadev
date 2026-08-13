import { useEffect, useState } from 'react';
import { Keyboard, Platform, type KeyboardEvent } from 'react-native';

const readKeyboardHeight = (event: KeyboardEvent): number =>
  Math.max(0, event.endCoordinates.height);

/**
 * Returns the keyboard overlap height from the bottom of the screen.
 * Used to lift sticky footers above the software keyboard on iOS and Android.
 */
export const useKeyboardInset = (): number => {
  const [inset, setInset] = useState(0);

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

  return inset;
};
