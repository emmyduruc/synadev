/**
 * SYNA design tokens — single source of truth for colors.
 * Imported by tailwind.config.ts in the client app.
 */
export const colors = {
  primary: {
    50: '#f5f0f2',
    100: '#e9e0e3',
    200: '#d3c0c8',
    300: '#b697a3',
    400: '#96697a',
    500: '#6d2e46',
    600: '#60283e',
    700: '#532335',
    800: '#441d2b',
    900: '#341622',
    950: '#230f16',
  },
  secondary: {
    50: '#f3f5f4',
    100: '#e7ebe9',
    200: '#cfd7d2',
    300: '#afbeb7',
    400: '#8c9f96',
    500: '#5e7b6e',
    600: '#536c61',
    700: '#475d54',
    800: '#3a4c44',
    900: '#2d3b35',
    950: '#1e2723',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    700: '#15803d',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    700: '#b45309',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    700: '#b91c1c',
  },
  background: {
    DEFAULT: '#ffffff',
    dark: '#0a0a0a',
  },
  foreground: {
    DEFAULT: '#171717',
    muted: '#737373',
    dark: '#fafafa',
  },
} as const;

export type ColorToken = typeof colors;
