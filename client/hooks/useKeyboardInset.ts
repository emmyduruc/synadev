import { useEffect, useState } from 'react';
import { Keyboard, Platform, type KeyboardEvent } from 'react-native';

const readKeyboardHeight = (event: KeyboardEvent): number =>
  Math.max(0, event.endCoordinates.height);

/**
 * Returns the keyboard overlap height from the bottom of the screen.
 * iOS: keyboard overlays content — apply this as bottom inset on footers.
 * Android: relies on `softwareKeyboardLayoutMode: "resize"` in app.json; returns 0
 * to avoid double-offset when the window already resizes.
 */
export const useKeyboardInset = (): number => {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return undefined;
    }

    const onShow = (event: KeyboardEvent) => {
      setInset(readKeyboardHeight(event));
    };

    const onHide = () => {
      setInset(0);
    };

    const showSubscription = Keyboard.addListener('keyboardWillShow', onShow);
    const hideSubscription = Keyboard.addListener('keyboardWillHide', onHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return inset;
};
