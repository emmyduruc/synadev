import type { ReactNode } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KeyboardStickyFooter } from '@/components/layout/KeyboardStickyFooter';
import { SAFE_AREA_EDGES, SafeAreaScreen } from '@/components/layout/SafeAreaScreen';
import { SynaGradientBackground } from '@/components/layout/SynaGradientBackground';
import type { AppHeaderProps } from '@/components/ui/AppHeader';
import { AppHeader } from '@/components/ui/AppHeader';
import { Box } from '@/components/ui/Box';
import { useKeyboardInset } from '@/hooks/useKeyboardInset';

export type AuthGradientLayoutProps = {
  children: ReactNode;
  header?: Pick<AppHeaderProps, 'title' | 'showBack' | 'fallbackHref' | 'right'>;
  scrollable?: boolean;
  footer?: ReactNode;
};

export const AuthGradientLayout = ({
  children,
  header,
  scrollable = true,
  footer,
}: AuthGradientLayoutProps) => {
  const keyboardInset = useKeyboardInset();
  const insets = useSafeAreaInsets();
  const hasStickyFooter = Boolean(footer);

  const content = (
    <Box flex={1} paddingX="lg" paddingY="md" className="mx-auto w-full max-w-md">
      {children}
    </Box>
  );

  const scrollPaddingBottom = (() => {
    if (hasStickyFooter) {
      return 24;
    }

    if (keyboardInset > 0) {
      return keyboardInset + 24;
    }

    return 24;
  })();

  const body = scrollable ? (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: scrollPaddingBottom,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      onScrollBeginDrag={Platform.OS === 'ios' ? Keyboard.dismiss : undefined}>
      {content}
    </ScrollView>
  ) : (
    content
  );

  const chrome = (
    <>
      {header ? (
        <View style={{ paddingTop: Math.max(insets.top, 8) }}>
          <AppHeader
            title={header.title}
            showBack={header.showBack}
            fallbackHref={header.fallbackHref}
            right={header.right}
          />
        </View>
      ) : null}

      <View style={{ flex: 1 }}>{body}</View>

      {footer ? <KeyboardStickyFooter>{footer}</KeyboardStickyFooter> : null}
    </>
  );

  return (
    <SynaGradientBackground>
      <SafeAreaScreen edges={SAFE_AREA_EDGES.none} style={{ backgroundColor: 'transparent' }}>
        {hasStickyFooter ? (
          <View style={{ flex: 1 }}>{chrome}</View>
        ) : (
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
          >
            {chrome}
          </KeyboardAvoidingView>
        )}
      </SafeAreaScreen>
    </SynaGradientBackground>
  );
};
