import type { ReactNode } from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import {
  cn,
  colorClasses,
  DEFAULT_MAX_FONT_SIZE_MULTIPLIER,
  fontFamilyByWeight,
  fontSizeClasses,
  fontWeightClasses,
  marginClasses,
  radiusClasses,
  spacingClasses,
  spacingXClasses,
  spacingYClasses,
  textAlignClasses,
  useResponsiveFontSize,
} from '@/lib/ui';
import type { ColorTone, FontSize, FontWeight, Radius, Spacing, TextAlign } from '@/lib/ui';

export type TextProps = RNTextProps & {
  children: ReactNode;
  size?: FontSize;
  weight?: FontWeight;
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

  return (
    <RNText
      className={cn(
        fontSizeClasses[size],
        fontWeightClasses[weight],
        colorClasses[color],
        textAlignClasses[align],
        padding && spacingClasses[padding],
        paddingX && spacingXClasses[paddingX],
        paddingY && spacingYClasses[paddingY],
        margin && marginClasses[margin],
        rounded && radiusClasses[rounded],
        className,
      )}
      style={[
        scaledFontSize ? { fontSize: scaledFontSize } : undefined,
        { fontFamily: fontFamilyByWeight[weight] },
        style,
      ]}
      {...props}
      maxFontSizeMultiplier={maxFontSizeMultiplier}>
      {children}
    </RNText>
  );
};
