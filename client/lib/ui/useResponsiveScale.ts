import { moderateScale } from '@syna/shared-utils';
import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';


import { fontSizePx } from './tokens';
import type { FontSize } from './types';


export const useResponsiveFontSize = (size: FontSize, enabled = true): number | undefined => {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    if (!enabled) {
      return undefined;
    }

    return moderateScale(fontSizePx[size], width);
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
