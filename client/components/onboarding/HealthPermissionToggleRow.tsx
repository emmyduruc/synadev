import { Switch } from 'react-native';

import { Box, Text } from '@/components/ui';
import { semanticColors } from '@/lib/ui';

export type HealthPermissionToggleRowProps = {
  label: string;
  value: boolean;
  disabled?: boolean;
  showDivider?: boolean;
  onValueChange: (next: boolean) => void;
};

export const HealthPermissionToggleRow = ({
  label,
  value,
  disabled = false,
  showDivider = true,
  onValueChange,
}: HealthPermissionToggleRowProps) => (
  <Box
    direction="row"
    align="center"
    justify="between"
    className={showDivider ? 'border-b border-border py-3.5' : 'py-3.5'}
  >
    <Text size="base" className="flex-1 pr-3 text-foreground">
      {label}
    </Text>
    <Switch
      value={value}
      disabled={disabled}
      onValueChange={onValueChange}
      trackColor={{
        false: semanticColors.muted,
        true: semanticColors.foreground,
      }}
      thumbColor={semanticColors.card}
      ios_backgroundColor={semanticColors.muted}
    />
  </Box>
);
