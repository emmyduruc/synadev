import type { TextStyle, ViewStyle } from 'react-native';

import { FONT_FAMILY } from '@/lib/fonts/constants';
import { semanticColors } from '@/lib/ui';

/**
 * Style objects for @quidone/react-native-wheel-picker props only.
 * That library accepts RN `style` props, not NativeWind `className`.
 */
export const WHEEL_PICKER_ITEM_HEIGHT = 48;
export const WHEEL_PICKER_VISIBLE_ITEM_COUNT = 5;
export const WHEEL_PICKER_HEIGHT = WHEEL_PICKER_ITEM_HEIGHT * WHEEL_PICKER_VISIBLE_ITEM_COUNT;

export const wheelPickerSelectionOverlayStyle: ViewStyle = {
  backgroundColor: semanticColors.codeHighlightLight,
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderColor: semanticColors.border,
  borderRadius: 12,
};

export const wheelPickerItemTextStyle: TextStyle = {
  color: semanticColors.foreground,
  fontFamily: FONT_FAMILY.semibold,
  fontSize: 20,
};
