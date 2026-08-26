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
  /** Top padding + tab row height inside SynaTabBar (excludes safe-area inset). */
  contentHeight: 62,
  minBottomPadding: 8,
} as const;

/** Vertical space the custom tab bar occupies from the window bottom. */
export const getSynaTabBarOccupiedHeight = (safeAreaBottom: number): number =>
  TAB_BAR.contentHeight + Math.max(safeAreaBottom, TAB_BAR.minBottomPadding);
