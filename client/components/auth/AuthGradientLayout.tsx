import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SynaGradientBackground } from '@/components/layout/SynaGradientBackground';
import type { AppHeaderProps } from '@/components/ui/AppHeader';
import { AppHeader } from '@/components/ui/AppHeader';
import { Box } from '@/components/ui/Box';

export type AuthGradientLayoutProps = {
  children: ReactNode;
  header?: Pick<AppHeaderProps, 'title' | 'showBack' | 'fallbackHref' | 'right'>;
  scrollable?: boolean;
};

export const AuthGradientLayout = ({
  children,
  header,
  scrollable = true,
}: AuthGradientLayoutProps) => {
  const content = (
    <Box flex={1} paddingX="lg" paddingY="md" className="mx-auto w-full max-w-md">
      {children}
    </Box>
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

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}>
          {scrollable ? (
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {content}
            </ScrollView>
          ) : (
            content
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SynaGradientBackground>
  );
};
