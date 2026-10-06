import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

// import { LinearGradient } from 'expo-linear-gradient';

import { semanticColors } from '@/lib/ui';

export type SynaGradientBackgroundProps = {
  children: ReactNode;
};

/**
 * App page background.
 * Gradient temporarily disabled: solid --page / --pastel-rose (#F7EFF2).
 *
 * To restore the vertical page wash (cream/apricot → rose → plum/lavender):
 *
 * ```tsx
 * <LinearGradient
 *   colors={[
 *     semanticColors.page.gradientTop,
 *     semanticColors.page.gradientMid,
 *     semanticColors.page.gradientBottom,
 *   ]}
 *   locations={[0, 0.5, 1]}
 *   start={{ x: 0.5, y: 0 }}
 *   end={{ x: 0.5, y: 1 }}
 *   style={styles.page}>
 *   {children}
 * </LinearGradient>
 * ```
 */
export const SynaGradientBackground = ({ children }: SynaGradientBackgroundProps) => (
  <View style={styles.page}>{children}</View>
);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: semanticColors.page.DEFAULT,
  },
});
