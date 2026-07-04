export const TAB_ROUTE = {
  start: 'index',
  muster: 'muster',
  syna: 'syna',
  bericht: 'bericht',
  ich: 'ich',
} as const;

export type TabRouteName = (typeof TAB_ROUTE)[keyof typeof TAB_ROUTE];

export const TAB_BAR = {
  centerRoute: TAB_ROUTE.syna,
  badgeRoute: TAB_ROUTE.muster,
  centerButtonSize: 56,
  centerButtonLift: 18,
} as const;
