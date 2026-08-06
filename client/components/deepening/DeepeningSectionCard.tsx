import type { SymbolViewProps } from 'expo-symbols';
import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { semanticColors } from '@/lib/ui';

export type DeepeningSectionCardProps = {
  title: string;
  icon: SymbolViewProps['name'];
  children: ReactNode;
};

export const DeepeningSectionCard = ({
  title,
  icon,
  children,
}: DeepeningSectionCardProps) => (
  <Box gap="md" className="rounded-2xl border border-white/60 bg-white/90 p-5">
    <Box direction="row" align="center" gap="sm">
      <SymbolView name={icon} size={16} tintColor={semanticColors.splashBackground} />
      <Text
        size="2xs"
        weight="semibold"
        color="primary"
        className="tracking-widest">
        {title}
      </Text>
    </Box>
    <Box gap="md">{children}</Box>
  </Box>
);
