import type { ReactNode } from 'react';

import { KeyboardStickyFooter } from '@/components/layout/KeyboardStickyFooter';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';

export type WizardShellProps = {
  children: ReactNode;
  footer: ReactNode;
  skippable?: boolean;
  onSkip?: () => void;
  stepLabel?: string;
};

export const WizardShell = ({
  children,
  footer,
  skippable = false,
  onSkip,
  stepLabel,
}: WizardShellProps) => {
  const { t } = useTranslate();

  return (
    <Box flex={1} fullWidth background="background">
      <Box direction="row" justify="between" align="center" paddingX="lg" paddingY="sm">
        <Box className="min-h-8 min-w-16 justify-center">
          {stepLabel ? (
            <Text size="xs" color="foreground-muted" weight="medium">
              {stepLabel}
            </Text>
          ) : null}
        </Box>
        {skippable && onSkip ? (
          <TouchableOpacity accessibilityRole="button" onPress={onSkip}>
            <Text size="sm" color="foreground-muted" className="underline">
              {t('wizard_skip_button')}
            </Text>
          </TouchableOpacity>
        ) : (
          <Box className="min-w-16" />
        )}
      </Box>

      <Box flex={1}>{children}</Box>

      <KeyboardStickyFooter>{footer}</KeyboardStickyFooter>
    </Box>
  );
};
