import { moderateScale } from '@syna/shared-utils';
import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import { fontSizePx } from './tokens';
import type { FontSize } from './types';
import { FONT_SCALE_MAX_WIDTH } from './typography';

export const useResponsiveFontSize = (size: FontSize, enabled = true): number | undefined => {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    if (!enabled) {
      return undefined;
    }

    const scaleWidth = Math.min(width, FONT_SCALE_MAX_WIDTH);

    return moderateScale(fontSizePx[size], scaleWidth);
  }, [enabled, size, width]);
};

export const useResponsiveScale = (baseSize: number, enabled = true): number | undefined => {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    if (!enabled) {
      return undefined;
    }

    return moderateScale(baseSize, width);
  }, [baseSize, enabled, width]);
};
