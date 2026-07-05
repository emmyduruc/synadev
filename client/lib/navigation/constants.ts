export const TAB_ROUTE = {
  start: 'index',
  patterns: 'patterns',
  syna: 'syna',
  report: 'report',
  profile: 'profile',
} as const;

export type TabRouteName = (typeof TAB_ROUTE)[keyof typeof TAB_ROUTE];

export const TAB_BAR = {
  centerRoute: TAB_ROUTE.syna,
  badgeRoute: TAB_ROUTE.patterns,
  centerButtonSize: 56,
  centerButtonLift: 18,
} as const;
