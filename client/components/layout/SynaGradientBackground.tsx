import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';

import { semanticColors } from '@/lib/ui';

export type SynaGradientBackgroundProps = {
  children: ReactNode;
};

export const SynaGradientBackground = ({ children }: SynaGradientBackgroundProps) => (
  <LinearGradient
    colors={[
      semanticColors.authGradient.lavender,
      semanticColors.authGradient.dustyRose,
      semanticColors.authGradient.sageMist,
    ]}
    locations={[0, 0.45, 1]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.gradient}>
    {children}
  </LinearGradient>
);

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
