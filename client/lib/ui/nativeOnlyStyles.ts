import type { TextStyle } from 'react-native';

import { FONT_FAMILY } from '@/lib/fonts/constants';

/**
 * RN style objects for components that do not support NativeWind `className`
 * (e.g. hidden TextInput used for OTP capture).
 */
export const hiddenOtpInputStyle: TextStyle = {
  position: 'absolute',
  opacity: 0,
  width: 1,
  height: 1,
  fontFamily: FONT_FAMILY.regular,
};
