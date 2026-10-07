import type { ReactNode } from 'react';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';

export type ClinicalSectionCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export const ClinicalSectionCard = ({
  title,
  description,
  children,
}: ClinicalSectionCardProps) => (
  <Box className="overflow-hidden rounded-2xl border border-border bg-card px-5 py-5" gap="md">
    <Box gap="xs">
      <Text size="base" weight="bold" family="serif" className="leading-tight">
        {title}
      </Text>
      {description ? (
        <Text
          size="sm"
          color="foreground-muted"
          family="sans"
          className="leading-relaxed">
          {description}
        </Text>
      ) : null}
    </Box>
    {children}
  </Box>
);
