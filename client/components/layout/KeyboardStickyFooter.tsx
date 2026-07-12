import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useKeyboardInset } from '@/hooks/useKeyboardInset';

export type KeyboardStickyFooterProps = {
  children: ReactNode;
  /** Extra spacing between footer content and keyboard / safe area. */
  gap?: number;
};

/**
 * Pins footer actions directly above the software keyboard (iOS) or resized window
 * bottom (Android). Use at the bottom of full-screen layouts with a flex content area.
 */
export const KeyboardStickyFooter = ({ children, gap = 12 }: KeyboardStickyFooterProps) => {
  const keyboardInset = useKeyboardInset();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const bottomSpacing = keyboardInset > 0 ? keyboardInset + gap : Math.max(safeAreaBottom, gap);

  return (
    <View style={[styles.footer, { paddingBottom: bottomSpacing }]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingTop: 8,
  },
});
