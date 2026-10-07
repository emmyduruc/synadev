import type { ReactNode } from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import {
  cn,
  colorClasses,
  DEFAULT_MAX_FONT_SIZE_MULTIPLIER,
  fontSerifWeightClasses,
  fontSizeClasses,
  fontWeightClasses,
  marginClasses,
  radiusClasses,
  resolveDefaultFontFamily,
  resolveFontFamilyName,
  spacingClasses,
  spacingXClasses,
  spacingYClasses,
  textAlignClasses,
  useResponsiveFontSize,
} from '@/lib/ui';
import type {
  ColorTone,
  FontFamilyTone,
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  TextAlign,
} from '@/lib/ui';

export type TextProps = RNTextProps & {
  children: ReactNode;
  size?: FontSize;
  weight?: FontWeight;
  /** sans = Figtree (body/nav); serif = Outfit (headings). Auto: xl+ → serif. */
  family?: FontFamilyTone;
  /** Align digits in columns (wearable values, calendar days, display scores). */
  tabularNums?: boolean;
  color?: ColorTone;
  align?: TextAlign;
  padding?: Spacing;
  paddingX?: Spacing;
  paddingY?: Spacing;
  margin?: Spacing;
  rounded?: Radius;
  responsive?: boolean;
  className?: string;
};

export const Text = ({
  children,
  size = 'base',
  weight = 'normal',
  family,
  tabularNums = false,
  color = 'foreground',
  align = 'left',
  padding,
  paddingX,
  paddingY,
  margin,
  rounded,
  responsive = true,
  className,
  style,
  maxFontSizeMultiplier = DEFAULT_MAX_FONT_SIZE_MULTIPLIER,
  ...props
}: TextProps) => {
  const scaledFontSize = useResponsiveFontSize(size, responsive);
  const resolvedFamily = resolveDefaultFontFamily(size, family);
  const weightClass =
    resolvedFamily === 'serif'
      ? fontSerifWeightClasses[weight]
      : fontWeightClasses[weight];

  return (
    <RNText
      className={cn(
        fontSizeClasses[size],
        weightClass,
        colorClasses[color],
        textAlignClasses[align],
        tabularNums && 'tabular-nums',
        padding && spacingClasses[padding],
        paddingX && spacingXClasses[paddingX],
        paddingY && spacingYClasses[paddingY],
        margin && marginClasses[margin],
        rounded && radiusClasses[rounded],
        className,
      )}
      style={[
        scaledFontSize ? { fontSize: scaledFontSize } : undefined,
        {
          fontFamily: resolveFontFamilyName(resolvedFamily, weight),
          ...(tabularNums ? { fontVariant: ['tabular-nums' as const] } : {}),
        },
        style,
      ]}
      {...props}
      maxFontSizeMultiplier={maxFontSizeMultiplier}>
      {children}
    </RNText>
  );
};
