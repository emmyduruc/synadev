import type { BannerVariant, ButtonVariant } from './types';

import { colors } from '@/utils/colors';

/** Runtime color values for props that require hex (tintColor, ActivityIndicator, etc.). */
export const semanticColors = {
  foreground: colors.foreground.DEFAULT,
  foregroundMuted: colors.foreground.muted,
  background: colors.background.DEFAULT,
  card: colors.card.DEFAULT,
  muted: colors.muted.DEFAULT,
  mutedForeground: colors.muted.foreground,
  border: colors.border.DEFAULT,
  input: colors.input.DEFAULT,
  accent: colors.accent.DEFAULT,
  ring: colors.ring.DEFAULT,
  destructive: colors.destructive.DEFAULT,
  splashBackground: colors.primary[500],
  splashForeground: colors.card.DEFAULT,
  placeholder: colors.slate.light,
  iconOnPrimary: colors.card.DEFAULT,
  iconDismiss: colors.slate.DEFAULT,
  link: colors.primary[600],
  separatorLight: colors.border.DEFAULT,
  separatorDark: 'rgba(255, 255, 255, 0.1)',
  themedTextLight: 'rgba(0, 0, 0, 0.8)',
  themedTextDark: 'rgba(255, 255, 255, 0.8)',
  codeHighlightLight: 'rgba(0, 0, 0, 0.05)',
  codeHighlightDark: 'rgba(255, 255, 255, 0.05)',
  /** SYNA Ovum palette — symptom categories, washes, gradients */
  ovum: {
    lavender: colors.lavender.DEFAULT,
    lavenderLight: colors.lavender.light,
    sageMist: colors['sage-mist'].DEFAULT,
    sageMistLight: colors['sage-mist'].light,
    dustyRose: colors['dusty-rose'].DEFAULT,
    dustyRoseLight: colors['dusty-rose'].light,
    apricot: colors.apricot.DEFAULT,
    apricotLight: colors.apricot.light,
    slate: colors.slate.DEFAULT,
    slateLight: colors.slate.light,
  },
  authGradient: {
    lavenderLight: colors.lavender.light,
    lavender: colors.lavender.DEFAULT,
    apricot: colors.apricot.DEFAULT,
    sageMist: colors['sage-mist'].DEFAULT,
    dustyRose: colors['dusty-rose'].DEFAULT,
  },
  authGlass: 'rgba(255, 255, 255, 0.88)',
  authGlassBorder: 'rgba(255, 255, 255, 0.6)',
  authDivider: colors.lavender.DEFAULT,
  socialIcon: {
    apple: colors.foreground.DEFAULT,
    googleBlue: '#4285F4',
    googleGreen: '#34A853',
    googleRed: '#EA4335',
    googleYellow: '#FBBC05',
  },
  bannerIcon: {
    info: colors.primary[600],
    success: colors.success[700],
    warning: colors.warning[700],
    error: colors.error[700],
  } satisfies Record<BannerVariant, string>,
} as const;

export const BUTTON_VARIANT = {
  primary: 'primary',
  secondary: 'secondary',
  outline: 'outline',
  ghost: 'ghost',
  danger: 'danger',
} as const satisfies Record<ButtonVariant, ButtonVariant>;

export const VALIDATION_CHARS = {
  atSign: '@',
} as const;

export const PLATFORM_OS = {
  ios: 'ios',
  android: 'android',
  web: 'web',
} as const;

export const STATUS_BAR_STYLE = {
  light: 'light',
  auto: 'auto',
} as const;

export const COLOR_SCHEME = {
  dark: 'dark',
  light: 'light',
} as const;

export const isLightButtonVariant = (variant: ButtonVariant): boolean =>
  variant === BUTTON_VARIANT.outline || variant === BUTTON_VARIANT.ghost;
