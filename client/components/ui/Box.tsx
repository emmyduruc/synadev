import type { ReactNode } from 'react';
import { View as RNView, type ViewProps as RNViewProps } from 'react-native';

import {
  alignItemsClasses,
  backgroundColorClasses,
  borderColorClasses,
  cn,
  flexClasses,
  flexDirectionClasses,
  justifyContentClasses,
  marginClasses,
  radiusClasses,
  spacingClasses,
  spacingXClasses,
  spacingYClasses,
  useResponsiveScale,
} from '@/lib/ui';
import type {
  AlignItems,
  ColorTone,
  FlexDirection,
  FlexValue,
  JustifyContent,
  Radius,
  Spacing,
} from '@/lib/ui';

export type BoxProps = RNViewProps & {
  children?: ReactNode;
  flex?: FlexValue;
  direction?: FlexDirection;
  align?: AlignItems;
  justify?: JustifyContent;
  padding?: Spacing;
  paddingX?: Spacing;
  paddingY?: Spacing;
  margin?: Spacing;
  gap?: Spacing;
  rounded?: Radius;
  background?: ColorTone;
  borderColor?: ColorTone;
  border?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  responsiveWidth?: number;
  responsiveHeight?: number;
  className?: string;
};

const gapClasses: Record<Spacing, string> = {
  none: '',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-10',
};

export const Box = ({
  children,
  flex,
  direction = 'column',
  align,
  justify,
  padding,
  paddingX,
  paddingY,
  margin,
  gap,
  rounded,
  background,
  borderColor,
  border = false,
  fullWidth = false,
  fullHeight = false,
  responsiveWidth,
  responsiveHeight,
  className,
  style,
  ...props
}: BoxProps) => {
  const scaledWidth = useResponsiveScale(responsiveWidth ?? 0, Boolean(responsiveWidth));
  const scaledHeight = useResponsiveScale(responsiveHeight ?? 0, Boolean(responsiveHeight));

  return (
    <RNView
      className={cn(
        'flex',
        flex !== undefined && flexClasses[flex],
        flexDirectionClasses[direction],
        align && alignItemsClasses[align],
        justify && justifyContentClasses[justify],
        padding && spacingClasses[padding],
        paddingX && spacingXClasses[paddingX],
        paddingY && spacingYClasses[paddingY],
        margin && marginClasses[margin],
        gap && gapClasses[gap],
        rounded && radiusClasses[rounded],
        background && backgroundColorClasses[background],
        border && 'border',
        borderColor && borderColorClasses[borderColor],
        fullWidth && 'w-full',
        fullHeight && 'h-full',
        className,
      )}
      style={[
        scaledWidth ? { width: scaledWidth } : undefined,
        scaledHeight ? { height: scaledHeight } : undefined,
        style,
      ]}
      {...props}>
      {children}
    </RNView>
  );
};
