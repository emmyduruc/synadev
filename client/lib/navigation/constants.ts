export const TAB_ROUTE = {
  start: 'index',
  capture: 'capture',
  course: 'course',
  report: 'report',
  profile: 'profile',
  patterns: 'patterns',
  syna: 'syna',
} as const;

export type TabRouteName = (typeof TAB_ROUTE)[keyof typeof TAB_ROUTE];

/** Tabs shown in the bottom bar (order matches design). */
export const TAB_BAR_VISIBLE_ROUTES = [
  TAB_ROUTE.start,
  TAB_ROUTE.capture,
  TAB_ROUTE.course,
  TAB_ROUTE.report,
] as const;

export type TabBarVisibleRoute = (typeof TAB_BAR_VISIBLE_ROUTES)[number];

export const TAB_BAR = {
  contentHeight: 62,
  minBottomPadding: 8,
} as const;

/** Vertical space the custom tab bar occupies from the window bottom. */
export const getSynaTabBarOccupiedHeight = (safeAreaBottom: number): number =>
  TAB_BAR.contentHeight + Math.max(safeAreaBottom, TAB_BAR.minBottomPadding);
