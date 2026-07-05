import {
  TouchableOpacity as RNTouchableOpacity,
  type TouchableOpacityProps as RNTouchableOpacityProps,
} from 'react-native';

import { TOUCHABLE_ACTIVE_OPACITY } from '@/lib/ui';

export type TouchableOpacityProps = RNTouchableOpacityProps;

export const TouchableOpacity = ({
  activeOpacity = TOUCHABLE_ACTIVE_OPACITY,
  ...props
}: TouchableOpacityProps) => (
  <RNTouchableOpacity activeOpacity={activeOpacity} {...props} />
);
