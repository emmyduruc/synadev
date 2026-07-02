import type { BannerVariant, ButtonVariant } from './types';

import { colors } from '@/utils/colors';

/** Runtime color values for props that require hex (tintColor, ActivityIndicator, etc.). */
export const semanticColors = {
  foreground: colors.foreground.DEFAULT,
  foregroundMuted: colors.foreground.muted,
  background: colors.background.DEFAULT,
  splashBackground: colors.primary[500],
  splashForeground: colors.background.DEFAULT,
  placeholder: colors.neutral[400],
  iconOnPrimary: colors.background.DEFAULT,
  iconDismiss: colors.neutral[600],
  link: colors.primary[600],
  separatorLight: colors.neutral[200],
  separatorDark: 'rgba(255, 255, 255, 0.1)',
  themedTextLight: 'rgba(0, 0, 0, 0.8)',
  themedTextDark: 'rgba(255, 255, 255, 0.8)',
  codeHighlightLight: 'rgba(0, 0, 0, 0.05)',
  codeHighlightDark: 'rgba(255, 255, 255, 0.05)',
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

export const isLightButtonVariant = (variant: ButtonVariant): boolean =>
  variant === BUTTON_VARIANT.outline || variant === BUTTON_VARIANT.ghost;
