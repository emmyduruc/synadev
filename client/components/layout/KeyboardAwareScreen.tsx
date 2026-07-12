import type { ReactNode } from 'react';
import { Keyboard, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useKeyboardInset } from '@/hooks/useKeyboardInset';

export type KeyboardAwareScreenProps = {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /** Minimum padding below scroll content so it clears the sticky footer. */
  footerClearance?: number;
};

/**
 * Full-screen column layout: header, scrollable body, sticky footer above keyboard.
 */
export const KeyboardAwareScreen = ({
  header,
  children,
  footer,
  footerClearance = 96,
}: KeyboardAwareScreenProps) => {
  const keyboardInset = useKeyboardInset();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const footerBottomSpacing =
    keyboardInset > 0 ? keyboardInset + 12 : Math.max(safeAreaBottom, 12);

  return (
    <View style={styles.root}>
      {header}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: footer ? footerClearance + footerBottomSpacing : 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={Platform.OS === 'ios' ? Keyboard.dismiss : undefined}>
        {children}
      </ScrollView>

      {footer ? (
        <View style={[styles.footer, { paddingBottom: footerBottomSpacing }]}>
          {footer}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  footer: {
    paddingTop: 8,
  },
});
