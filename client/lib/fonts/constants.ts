/**
 * App typefaces (loaded via useAppFonts).
 * - sans / Figtree: body, navigation, body numbers
 * - serif / Outfit: headings, titles, large display numbers
 * Weights used: 400, 500, 600 (bold maps to 600).
 */
export const FONT_FAMILY = {
  sans: {
    regular: 'Figtree_400Regular',
    medium: 'Figtree_500Medium',
    semibold: 'Figtree_600SemiBold',
  },
  serif: {
    regular: 'Outfit_400Regular',
    medium: 'Outfit_500Medium',
    semibold: 'Outfit_600SemiBold',
  },
  /** @deprecated Prefer FONT_FAMILY.sans.regular — kept for gradual migration. */
  regular: 'Figtree_400Regular',
  medium: 'Figtree_500Medium',
  semibold: 'Figtree_600SemiBold',
  bold: 'Figtree_600SemiBold',
} as const;

export type AppFontFamily = 'sans' | 'serif';

export type AppFontWeight = 'regular' | 'medium' | 'semibold';
