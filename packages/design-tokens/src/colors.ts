/**
 * SYNA design tokens — single source of truth for colors.
 * Imported by tailwind.config.ts in the client app.
 *
 * Base + brand values follow the SYNA Mobile-First design sheet.
 * Ovum palette tokens are category / wash colors for symptoms & UI accents.
 */
export const colors = {
  /** Dusty Rose Deep — CTA buttons, pattern accents */
  primary: {
    50: '#FAF4F6',
    100: '#F4E8ED',
    200: '#E8CED8',
    300: '#D4A8B8',
    400: '#BC8298',
    500: '#A55972',
    600: '#8F4D64',
    700: '#794054',
    800: '#633445',
    900: '#4D2836',
    950: '#361B26',
  },
  /** Soft chip / secondary surface */
  secondary: {
    DEFAULT: '#F0EDF1',
    50: '#F0EDF1',
    100: '#E8E4EA',
    200: '#D9D3DD',
    300: '#C4BBCB',
    400: '#A89DB2',
    500: '#8C7E98',
    600: '#756880',
    700: '#5E5368',
    800: '#473E50',
    900: '#302938',
    950: '#1E1A24',
  },
  /** Warm highlight */
  accent: {
    DEFAULT: '#E0B784',
    light: '#F1D5B0',
  },
  /** Focus ring */
  ring: {
    DEFAULT: '#9F84AD',
  },
  destructive: {
    DEFAULT: '#DC2828',
    50: '#FEF2F2',
    500: '#DC2828',
    700: '#B91C1C',
  },
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },
  success: {
    50: '#F0FDF4',
    500: '#22C55E',
    700: '#15803D',
  },
  warning: {
    50: '#FFFBEB',
    500: '#F59E0B',
    700: '#B45309',
  },
  error: {
    50: '#FEF2F2',
    500: '#EF4444',
    700: '#B91C1C',
  },
  card: {
    DEFAULT: '#FFFFFF',
  },
  muted: {
    DEFAULT: '#EFEDEA',
    foreground: '#7E7E8A',
  },
  border: {
    DEFAULT: '#EAE8E5',
  },
  input: {
    DEFAULT: '#E6E3DF',
  },
  /** SYNA Ovum palette — category washes & auth gradients */
  lavender: {
    DEFAULT: '#D1C1E1',
    light: '#EFEBF3',
  },
  'sage-mist': {
    DEFAULT: '#D5E6E0',
    light: '#EFF4F3',
  },
  'dusty-rose': {
    DEFAULT: '#DAB3B3',
    light: '#F4EBEB',
  },
  apricot: {
    DEFAULT: '#F1D5B0',
    light: '#F7F0E8',
  },
  slate: {
    DEFAULT: '#4C4C56',
    light: '#868691',
  },
  background: {
    DEFAULT: '#F8F5F1',
    dark: '#0A0A0A',
  },
  foreground: {
    DEFAULT: '#3B3B43',
    muted: '#7E7E8A',
    dark: '#FAFAFA',
  },
} as const;

export type ColorToken = typeof colors;
