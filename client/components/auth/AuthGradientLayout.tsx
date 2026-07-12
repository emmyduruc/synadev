import type { ReactNode } from 'react';
import { Keyboard, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KeyboardStickyFooter } from '@/components/layout/KeyboardStickyFooter';
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

  const content = (
    <Box flex={1} paddingX="lg" paddingY="md" className="mx-auto w-full max-w-md">
      {children}
    </Box>
  );

  const body = scrollable ? (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: keyboardInset > 0 ? keyboardInset + 24 : 24,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      onScrollBeginDrag={Platform.OS === 'ios' ? Keyboard.dismiss : undefined}>
      {content}
    </ScrollView>
  ) : (
    content
  );

  return (
    <SynaGradientBackground>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        {header ? (
          <AppHeader
            title={header.title}
            showBack={header.showBack}
            fallbackHref={header.fallbackHref}
            right={header.right}
          />
        ) : null}

        <View style={{ flex: 1 }}>{body}</View>

        {footer ? <KeyboardStickyFooter>{footer}</KeyboardStickyFooter> : null}
      </SafeAreaView>
    </SynaGradientBackground>
  );
};
