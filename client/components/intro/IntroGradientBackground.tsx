import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';

import { semanticColors } from '@/lib/ui';

export type IntroGradientBackgroundProps = {
  children: ReactNode;
};

/** Soft cream → lavender wash matching the conversion intro mock. */
export const IntroGradientBackground = ({ children }: IntroGradientBackgroundProps) => (
  <LinearGradient
    colors={[
      semanticColors.background,
      semanticColors.ovum.lavenderLight,
      semanticColors.ovum.lavenderLight,
    ]}
    locations={[0, 0.55, 1]}
    start={{ x: 0.5, y: 0 }}
    end={{ x: 0.5, y: 1 }}
    style={styles.gradient}
  >
    {children}
  </LinearGradient>
);

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
