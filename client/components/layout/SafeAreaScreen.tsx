import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

/**
 * Shared safe-area insets for screens and full-screen modals.
 *
 * Prefer this over raw `SafeAreaView` + `className` — NativeWind classNames can
 * overwrite the inset padding that `SafeAreaView` applies via `style`.
 */
export const SAFE_AREA_EDGES = {
  /** Top, bottom, and sides. */
  all: ['top', 'right', 'bottom', 'left'] as const satisfies readonly Edge[],
  /**
   * Top + sides only. Use when the bottom inset is handled elsewhere
   * (tab bar, `KeyboardStickyFooter`, or a sticky modal footer).
   */
  top: ['top', 'left', 'right'] as const satisfies readonly Edge[],
} as const;

export type SafeAreaScreenProps = {
  children: ReactNode;
  /** Defaults to {@link SAFE_AREA_EDGES.all}. */
  edges?: readonly Edge[];
  style?: StyleProp<ViewStyle>;
};

export const SafeAreaScreen = ({
  children,
  edges = SAFE_AREA_EDGES.all,
  style,
}: SafeAreaScreenProps) => (
  <SafeAreaView edges={[...edges]} style={[{ flex: 1 }, style]}>
    {children}
  </SafeAreaView>
);
