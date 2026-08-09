import type { ViewStyle } from 'react-native';

/**
 * Horizontal dashboard carousels: hug content height and avoid the extra
 * flex-grown gap under cards. Card shadows are stripped on the tiles themselves
 * (shadow-none) so ScrollView clipping does not leave a dark cut-off line.
 */
export const dashboardHorizontalScrollStyle: ViewStyle = {
  flexGrow: 0,
};

export const dashboardHorizontalScrollContentStyle: ViewStyle = {
  flexGrow: 0,
};
