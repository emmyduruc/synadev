import type { ReactNode } from 'react';

import type { BackButtonProps } from '@/components/ui/BackButton';
import { BackButton } from '@/components/ui/BackButton';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';

export type AppHeaderProps = {
  title: string;
  showBack?: boolean;
  right?: ReactNode;
  fallbackHref?: BackButtonProps['fallbackHref'];
  onBackPress?: BackButtonProps['onPress'];
};

export const AppHeader = ({
  title,
  showBack = true,
  right,
  fallbackHref,
  onBackPress,
}: AppHeaderProps) => (
  <Box direction="row" align="center" className="min-h-14 w-full px-4">
    <Box className="w-12" align="start">
      {showBack ? (
        <BackButton fallbackHref={fallbackHref} onPress={onBackPress} />
      ) : null}
    </Box>

    <Box flex={1} align="center">
      {title ? (
        <Text size="lg" weight="semibold" align="center">
          {title}
        </Text>
      ) : null}
    </Box>

    <Box className="w-12" align="end">
      {right}
    </Box>
  </Box>
);
