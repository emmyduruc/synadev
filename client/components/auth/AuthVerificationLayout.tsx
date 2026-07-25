import type { Href } from 'expo-router';
import type { ReactNode } from 'react';

import { KeyboardStickyFooter } from '@/components/layout/KeyboardStickyFooter';
import { SAFE_AREA_EDGES, SafeAreaScreen } from '@/components/layout/SafeAreaScreen';
import { AppHeader } from '@/components/ui/AppHeader';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';

export type AuthVerificationLayoutProps = {
  title: string;
  subtitle?: string;
  fallbackHref: Href;
  footer?: ReactNode;
  children: ReactNode;
};

export const AuthVerificationLayout = ({
  title,
  subtitle,
  fallbackHref,
  footer,
  children,
}: AuthVerificationLayoutProps) => (
  <Box flex={1} fullWidth background="background">
    <SafeAreaScreen edges={SAFE_AREA_EDGES.top}>
      <AppHeader
        title=""
        showBack
        fallbackHref={fallbackHref}
        right={undefined}
      />

      <Box flex={1} paddingX="lg" paddingY="md" gap="lg">
        <Box gap="sm">
          <Text size="3xl" weight="bold">
            {title}
          </Text>
          {subtitle ? (
            <Text size="sm" color="foreground-muted">
              {subtitle}
            </Text>
          ) : null}
        </Box>

        <Box flex={1} gap="lg">
          {children}
        </Box>
      </Box>

      {footer ? (
        <KeyboardStickyFooter>
          <Box gap="md" paddingX="lg">
            {footer}
          </Box>
        </KeyboardStickyFooter>
      ) : null}
    </SafeAreaScreen>
  </Box>
);
