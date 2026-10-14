import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Box } from '@/components/ui/Box';
import { CheckIcon } from '@/components/ui/icons/CheckIcon';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { semanticColors } from '@/lib/ui';

export type RegisterConsentOptionProps = {
  isSelected: boolean;
  onToggle: () => void;
  accessibilityLabel: string;
  children: ReactNode;
};

/**
 * Consent row matching the report checkbox option (CheckIcon + filled card).
 */
export const RegisterConsentOption = ({
  isSelected,
  onToggle,
  accessibilityLabel,
  children,
}: RegisterConsentOptionProps) => (
  <TouchableOpacity
    accessibilityRole="checkbox"
    accessibilityLabel={accessibilityLabel}
    accessibilityState={{ checked: isSelected }}
    onPress={onToggle}
    className="rounded-2xl border px-3.5 py-4"
    style={{
      backgroundColor: isSelected ? semanticColors.ink2 : semanticColors.card,
      borderColor: isSelected ? semanticColors.ink2 : semanticColors.border,
    }}
  >
    <Box direction="row" align="center" gap="md">
      <View
        className="h-6 w-6 items-center justify-center rounded-md"
        style={{
          backgroundColor: isSelected ? semanticColors.card : 'transparent',
          borderWidth: isSelected ? 0 : 1.5,
          borderColor: semanticColors.border,
        }}
      >
        {isSelected ? (
          <CheckIcon size={14} color={semanticColors.ink2} />
        ) : null}
      </View>

      <Box className="min-w-0 flex-1">
        {children}
      </Box>
    </Box>
  </TouchableOpacity>
);
