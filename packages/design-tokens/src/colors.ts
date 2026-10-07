/**
 * SYNA design tokens — single source of truth for colors.
 * Imported by tailwind.config.ts in the client app.
 *
 * Base + brand values follow the SYNA Mobile-First design sheet.
 * Ovum palette tokens are category / wash colors for symptoms & UI accents.
 */
export const colors = {
  /** Warm ink plum — CTA buttons, selected chips, calendar accents (= --ink-2 at 500) */
  primary: {
    50: '#F4F1F2',
    100: '#E8E3E5',
    200: '#D1C7CB',
    300: '#B3A4AA',
    400: '#8A7880',
    500: '#5B4A52',
    600: '#4D3E45',
    700: '#3F3339',
    800: '#32282D',
    900: '#251E22',
    950: '#181416',
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
    /** Meta / tertiary text (= --ink-3). */
    foreground: '#706168',
  },
  /**
   * Prototype ink text (warm plum, not cool gray).
   * --ink-2 body secondary, --ink-3 meta.
   */
  ink: {
    2: '#5B4A52',
    3: '#706168',
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
  /**
   * Heat scale — frequency tiles / vasomotor accents (design sheet `--heat-*`).
   * `heat-2` fills the segmented frequency bars on Courses.
   */
  heat: {
    1: '#F4EBEB',
    2: '#DAB3B3',
    3: '#C48B8B',
    4: '#5B4A52',
  },
  apricot: {
    DEFAULT: '#F1D5B0',
    light: '#F7F0E8',
  },
  slate: {
    DEFAULT: '#5B4A52',
    light: '#706168',
  },
  /** Soft pastel lavender wash (oklch 94.1% 0.0097 252.8) — intro illustration panels */
  'pastel-lavender': {
    DEFAULT: '#E7ECF2',
  },
  /** Page / brand surface tokens (design sheet --page, --surround, --surface). */
  surround: {
    DEFAULT: '#E7ECF2',
  },
  'pastel-rose': {
    DEFAULT: '#F7EFF2',
  },
  cream: {
    DEFAULT: '#F8F6F1',
  },
  'pastel-apricot': {
    DEFAULT: '#F8EBDD',
  },
  'plum-soft': {
    DEFAULT: '#E7ECF2',
  },
  'pastel-lavender-line': {
    DEFAULT: '#EFEBF3',
  },
  page: {
    DEFAULT: '#F7EFF2',
    /** Vertical page wash stops (cream/apricot → rose → plum/lavender). */
    gradientTop: '#F8F1E7',
    gradientMid: '#F7EFF2',
    gradientBottom: '#EBE8F1',
  },
  surface: {
    DEFAULT: 'rgba(252, 253, 255, 0.88)',
  },
  /**
   * Report / clinical surfaces (CSS vars from the report design sheet).
   * Prefer these for report screens and matching marketing washes.
   */
  report: {
    pageBackground: '#FFFFFF',
    canvasBackground: '#E9E5E0',
    headerBackground: '#E8DCE5',
    dataBackground: '#EBF0F6',
    instrumentBackground: '#F1E9F4',
    documentBackground: '#F7F2EC',
    voiceBackground: '#F5ECF0',
    deviceBackground: 'rgba(255, 255, 255, 0.62)',
    rule: 'rgba(92, 66, 87, 0.12)',
    hairline: 'rgba(92, 66, 87, 0.08)',
    measureLine: '#A9B8D0',
    measurePoint: '#6F87AE',
    bleeding: '#B07A8C',
  },
  background: {
    /** App page base (= --page / --pastel-rose). */
    DEFAULT: '#F7EFF2',
    dark: '#0A0A0A',
  },
  foreground: {
    DEFAULT: '#3F3037',
    /** Secondary body text (= --ink-2). Replaces cool gray. */
    muted: '#5B4A52',
    /** Meta / caption text (= --ink-3). */
    subtle: '#706168',
    dark: '#FAFAFA',
  },
} as const;

export type ColorToken = typeof colors;
