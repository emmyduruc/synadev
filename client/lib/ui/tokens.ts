import type {
  AlignItems,
  BannerSize,
  BannerVariant,
  ButtonSize,
  ButtonVariant,
  ColorTone,
  FlexDirection,
  FlexValue,
  FontSize,
  FontWeight,
  InputSize,
  JustifyContent,
  Radius,
  Spacing,
  TextAlign,
} from './types';

import { FONT_FAMILY } from '@/lib/fonts/constants';

export const fontFamilyByWeight: Record<FontWeight, string> = {
  normal: FONT_FAMILY.regular,
  medium: FONT_FAMILY.medium,
  semibold: FONT_FAMILY.semibold,
  bold: FONT_FAMILY.bold,
};

export const spacingClasses: Record<Spacing, string> = {
  none: '',
  xs: 'p-1',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
  '2xl': 'p-10',
};

export const spacingXClasses: Record<Spacing, string> = {
  none: '',
  xs: 'px-1',
  sm: 'px-2',
  md: 'px-4',
  lg: 'px-6',
  xl: 'px-8',
  '2xl': 'px-10',
};

export const spacingYClasses: Record<Spacing, string> = {
  none: '',
  xs: 'py-1',
  sm: 'py-2',
  md: 'py-4',
  lg: 'py-6',
  xl: 'py-8',
  '2xl': 'py-10',
};

export const marginClasses: Record<Spacing, string> = {
  none: '',
  xs: 'm-1',
  sm: 'm-2',
  md: 'm-4',
  lg: 'm-6',
  xl: 'm-8',
  '2xl': 'm-10',
};

export const radiusClasses: Record<Radius, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

export const fontSizeClasses: Record<FontSize, string> = {
  '2xs': 'text-2xs',
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
};

export const fontSizePx: Record<FontSize, number> = {
  '2xs': 10,
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

export const fontWeightClasses: Record<FontWeight, string> = {
  normal: 'font-sans',
  medium: 'font-sans-medium',
  semibold: 'font-sans-semibold',
  bold: 'font-sans-bold',
};

export const textAlignClasses: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

export const colorClasses: Record<ColorTone, string> = {
  primary: 'text-primary-600',
  'primary-muted': 'text-primary-400',
  secondary: 'text-secondary-600',
  neutral: 'text-neutral-600',
  success: 'text-success-700',
  warning: 'text-warning-700',
  error: 'text-error-700',
  foreground: 'text-foreground',
  'foreground-muted': 'text-foreground-muted',
  background: 'text-background',
  white: 'text-white',
};

export const backgroundColorClasses: Record<ColorTone, string> = {
  primary: 'bg-primary-600',
  'primary-muted': 'bg-primary-100',
  secondary: 'bg-secondary-600',
  neutral: 'bg-neutral-100',
  success: 'bg-success-50',
  warning: 'bg-warning-50',
  error: 'bg-error-50',
  foreground: 'bg-foreground',
  'foreground-muted': 'bg-neutral-200',
  background: 'bg-background',
  white: 'bg-white',
};

export const borderColorClasses: Record<ColorTone, string> = {
  primary: 'border-primary-500',
  'primary-muted': 'border-primary-200',
  secondary: 'border-secondary-500',
  neutral: 'border-neutral-300',
  success: 'border-success-500',
  warning: 'border-warning-500',
  error: 'border-error-500',
  foreground: 'border-foreground',
  'foreground-muted': 'border-neutral-300',
  background: 'border-background',
  white: 'border-white',
};

export const flexDirectionClasses: Record<FlexDirection, string> = {
  row: 'flex-row',
  column: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'column-reverse': 'flex-col-reverse',
};

export const alignItemsClasses: Record<AlignItems, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

export const justifyContentClasses: Record<JustifyContent, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

export const flexClasses: Record<FlexValue, string> = {
  0: 'flex-none',
  1: 'flex-1',
  2: 'flex-[2]',
  3: 'flex-[3]',
  4: 'flex-[4]',
  5: 'flex-[5]',
  6: 'flex-[6]',
  7: 'flex-[7]',
  8: 'flex-[8]',
  9: 'flex-[9]',
  10: 'flex-[10]',
  11: 'flex-[11]',
  12: 'flex-[12]',
};

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary-500 active:bg-primary-600',
  secondary: 'bg-secondary-600 active:bg-secondary-700',
  outline: 'border border-primary-300 bg-white/70 active:bg-white',
  ghost: 'bg-transparent active:bg-white/50',
  danger: 'bg-error-500 active:bg-error-700',
};

export const buttonTextClasses: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-white',
  outline: 'text-foreground',
  ghost: 'text-foreground',
  danger: 'text-white',
};

export const buttonSizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4',
  md: 'h-12 px-5',
  lg: 'h-14 px-6',
};

export const buttonTextSizeClasses: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export const inputSizeClasses: Record<InputSize, string> = {
  sm: 'h-10 text-sm',
  md: 'h-12 text-base',
  lg: 'h-14 text-lg',
};

export const inputPaddingClasses: Record<InputSize, string> = {
  sm: 'px-3',
  md: 'px-4',
  lg: 'px-5',
};

export const bannerVariantClasses: Record<BannerVariant, string> = {
  info: 'bg-primary-50 border-primary-200',
  success: 'bg-success-50 border-success-500/30',
  warning: 'bg-warning-50 border-warning-500/30',
  error: 'bg-error-50 border-error-500/30',
};

export const bannerTextClasses: Record<BannerVariant, string> = {
  info: 'text-primary-800',
  success: 'text-success-700',
  warning: 'text-warning-700',
  error: 'text-error-700',
};

export const bannerSizeClasses: Record<BannerSize, string> = {
  sm: 'px-3 py-2',
  md: 'px-4 py-3',
  lg: 'px-5 py-4',
};

export const bannerTitleSizeClasses: Record<BannerSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};
