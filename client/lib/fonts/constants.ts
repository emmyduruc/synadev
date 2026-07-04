/** Loaded via useAppFonts — keys must match expo-font registration. */
export const FONT_FAMILY = {
  regular: 'Montserrat_400Regular',
  medium: 'Montserrat_500Medium',
  semibold: 'Montserrat_600SemiBold',
  bold: 'Montserrat_700Bold',
} as const;

export type AppFontWeight = keyof typeof FONT_FAMILY;
