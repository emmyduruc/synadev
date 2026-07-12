import type { ReactNode } from 'react';
import { Keyboard, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/Box';
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
    <Box flex={1} fullWidth>
      {header}

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: footer ? footerClearance + footerBottomSpacing : 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={Platform.OS === 'ios' ? Keyboard.dismiss : undefined}>
        {children}
      </ScrollView>

      {footer ? (
        <Box className="pt-2" style={{ paddingBottom: footerBottomSpacing }}>
          {footer}
        </Box>
      ) : null}
    </Box>
  );
};
