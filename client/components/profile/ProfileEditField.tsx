import type { ReactNode } from 'react';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';

export type ProfileEditFieldProps = {
  label: string;
  hint?: string;
  children: ReactNode;
};

export const ProfileEditField = ({
  label,
  hint,
  children,
}: ProfileEditFieldProps) => (
  <Box gap="sm">
    <Text size="sm" weight="medium">
      {label}
    </Text>
    {children}
    {hint ? (
      <Text size="xs" color="foreground-muted">
        {hint}
      </Text>
    ) : null}
  </Box>
);
