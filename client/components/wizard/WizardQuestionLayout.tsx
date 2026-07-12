import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useKeyboardInset } from '@/hooks/useKeyboardInset';

export type WizardQuestionLayoutProps = {
  eyebrow?: string;
  title: string;
  children: ReactNode;
  /** Use `start` for tall controls like date wheels so they are not vertically centered away. */
  contentAlign?: 'center' | 'start';
};

export const WizardQuestionLayout = ({
  eyebrow,
  title,
  children,
  contentAlign = 'center',
}: WizardQuestionLayoutProps) => {
  const keyboardInset = useKeyboardInset();
  const isKeyboardVisible = keyboardInset > 0;
  const shouldAlignStart = contentAlign === 'start' || isKeyboardVisible;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inner,
          shouldAlignStart ? styles.innerStart : styles.innerCentered,
          isKeyboardVisible ? styles.innerCompact : undefined,
        ]}>
        <View style={styles.copyBlock}>
          {eyebrow ? (
            <Text size="sm" color="foreground-muted">
              {eyebrow}
            </Text>
          ) : null}
          <Text size="3xl" weight="bold" className="leading-tight">
            {title}
          </Text>
        </View>

        <View style={styles.inputBlock}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 24,
    gap: 24,
  },
  innerCentered: {
    justifyContent: 'center',
  },
  innerStart: {
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  innerCompact: {
    paddingTop: 16,
    gap: 20,
  },
  copyBlock: {
    gap: 8,
  },
  inputBlock: {
    gap: 12,
  },
});
