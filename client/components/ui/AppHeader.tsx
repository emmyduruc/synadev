import { useRouter, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import { Pressable } from 'react-native';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { ROUTES } from '@/lib/routes';
import { semanticColors } from '@/lib/ui';

export type AppHeaderProps = {
  title: string;
  showBack?: boolean;
  right?: ReactNode;
  fallbackHref?: Href;
};

export const AppHeader = ({
  title,
  showBack = true,
  right,
  fallbackHref = ROUTES.register,
}: AppHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(fallbackHref);
  };

  return (
    <Box direction="row" align="center" className="min-h-14 w-full px-4">
      <Box className="w-12">
        {showBack ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={handleBack}>
            <SymbolView
              name={{ ios: 'chevron.left', android: 'arrow_back', web: 'chevron_left' }}
              size={22}
              tintColor={semanticColors.foreground}
            />
          </Pressable>
        ) : null}
      </Box>

      <Box flex={1} align="center">
        <Text size="lg" weight="semibold" align="center">
          {title}
        </Text>
      </Box>

      <Box className="w-12" align="end">
        {right}
      </Box>
    </Box>
  );
};
