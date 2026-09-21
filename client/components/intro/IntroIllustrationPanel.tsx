import type { ReactNode } from 'react';

import { Box } from '@/components/ui/Box';
import { semanticColors } from '@/lib/ui';

export type IntroIllustrationPanelProps = {
  children: ReactNode;
};

/** Shared soft panel behind intro marketing illustrations. */
export const IntroIllustrationPanel = ({ children }: IntroIllustrationPanelProps) => (
  <Box
    flex={1}
    align="center"
    justify="center"
    className="overflow-hidden rounded-3xl px-5 py-10"
    style={{ backgroundColor: semanticColors.ovum.pastelLavender }}
  >
    {children}
  </Box>
);
