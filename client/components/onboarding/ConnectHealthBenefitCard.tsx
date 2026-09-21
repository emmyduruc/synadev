import type { ReactNode } from 'react';

import { Box, Text } from '@/components/ui';

export type ConnectHealthBenefitCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  highlight?: string;
};

export const ConnectHealthBenefitCard = ({
  icon,
  title,
  description,
  highlight,
}: ConnectHealthBenefitCardProps) => (
  <Box
    direction="row"
    gap="md"
    padding="lg"
    rounded="2xl"
    className="border border-white/60 bg-white/90 shadow-sm shadow-primary-200/20"
  >
    <Box className="pt-0.5">{icon}</Box>
    <Box flex={1} gap="xs">
      <Text size="base" weight="semibold" className="text-foreground">
        {title}
      </Text>
      <Text size="sm" color="foreground-muted" className="leading-relaxed">
        {description}
      </Text>
      {highlight ? (
        <Text size="sm" weight="semibold" color="primary" className="mt-1">
          {highlight}
        </Text>
      ) : null}
    </Box>
  </Box>
);
