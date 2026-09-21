import { Switch } from 'react-native';

import { Box, Text } from '@/components/ui';
import { semanticColors } from '@/lib/ui';

export type HealthPermissionToggleRowProps = {
  label: string;
  showDivider?: boolean;
};

/** Read-only preview row (always on). Hint for the OS health permission sheet. */
export const HealthPermissionToggleRow = ({
  label,
  showDivider = true,
}: HealthPermissionToggleRowProps) => (
  <Box
    direction="row"
    align="center"
    justify="between"
    className={showDivider ? 'border-b border-border py-3.5' : 'py-3.5'}
  >
    <Text size="base" color="foreground" className="flex-1 pr-3">
      {label}
    </Text>
    <Switch
      value
      disabled
      trackColor={{
        false: semanticColors.muted,
        true: semanticColors.report.bleeding,
      }}
      thumbColor={semanticColors.card}
      ios_backgroundColor={semanticColors.muted}
    />
  </Box>
);
