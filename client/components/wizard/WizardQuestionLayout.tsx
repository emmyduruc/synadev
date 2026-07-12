import type { ReactNode } from 'react';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useKeyboardInset } from '@/hooks/useKeyboardInset';
import { cn } from '@/lib/ui';

export type WizardQuestionLayoutProps = {
  eyebrow?: string;
  title: string;
  children: ReactNode;
  /** Use `start` so content sits below the title (better with keyboard and tall controls). */
  contentAlign?: 'center' | 'start';
};

export const WizardQuestionLayout = ({
  eyebrow,
  title,
  children,
  contentAlign = 'start',
}: WizardQuestionLayoutProps) => {
  const keyboardInset = useKeyboardInset();
  const isKeyboardVisible = keyboardInset > 0;
  const shouldAlignStart = contentAlign === 'start' || isKeyboardVisible;

  return (
    <Box flex={1} fullWidth>
      <Box
        flex={1}
        fullWidth
        paddingX="lg"
        gap="lg"
        className={cn(
          shouldAlignStart ? 'justify-start pt-2' : 'justify-center',
          isKeyboardVisible && 'gap-5 pt-4',
        )}>
        <Box gap="sm">
          {eyebrow ? (
            <Text size="sm" color="foreground-muted">
              {eyebrow}
            </Text>
          ) : null}
          <Text size="3xl" weight="bold" className="leading-tight">
            {title}
          </Text>
        </Box>

        <Box gap="sm">{children}</Box>
      </Box>
    </Box>
  );
};
