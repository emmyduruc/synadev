/**
 * Dashboard surface + accent tokens.
 * Ovum palette (lavender, dusty rose, sage, apricot) blended with primary blush
 * for a warm, feminine UI that still reads clearly on the Syna gradient.
 */
const tintedShell = 'rounded-3xl border shadow-sm';
const tintedTile = 'rounded-2xl border shadow-sm';

export const DASHBOARD_SURFACE = {
  /** Lavender shell — calendar + check-in panel */
  lavenderShell: `${tintedShell} border-lavender bg-lavender-light`,
  /** Primary blush — cycle phase, emotional highlights */
  blushCard: `${tintedShell} border-primary-200 bg-primary-50`,
  /** Dusty rose — period / body rhythm */
  roseCard: `${tintedShell} border-dusty-rose bg-dusty-rose-light`,
  /** Sage mist — health / wellness data */
  sageCard: `${tintedShell} border-sage-mist bg-sage-mist-light`,
  /** Apricot warmth — mood / comfort */
  apricotCard: `${tintedShell} border-apricot bg-apricot-light`,
  /** Crisp white lift on tinted parents */
  nestedLift: 'rounded-2xl border border-white bg-card shadow-sm',
  /** Soft blush inset */
  nestedBlush: 'rounded-2xl border border-primary-100 bg-primary-50/80',
  iconButton: 'items-center justify-center rounded-full border border-white bg-card shadow-sm',
} as const;

export const DASHBOARD_HEALTH_METRIC_SURFACE = {
  steps: `${tintedTile} border-dusty-rose bg-dusty-rose-light`,
  activity: `${tintedTile} border-sage-mist bg-sage-mist-light`,
  hrv: `${tintedTile} border-lavender bg-lavender-light`,
  sleep: `${tintedTile} border-apricot bg-apricot-light`,
} as const;

/** Circular icon wells — always include rounded-full so shadows match the shape */
const iconWellBase = 'items-center justify-center rounded-full border shadow-sm';

/** Icon wells — white gems or primary rose accents */
export const DASHBOARD_ICON_WELL = {
  gem: `${iconWellBase} bg-card border-white`,
  primaryGem: `${iconWellBase} bg-primary-500 border-primary-400`,
  lavenderGem: `${iconWellBase} bg-lavender border-lavender-light`,
  sageGem: `${iconWellBase} bg-sage-mist border-sage-mist-light`,
  apricotGem: `${iconWellBase} bg-apricot border-apricot-light`,
  roseGem: `${iconWellBase} bg-dusty-rose border-dusty-rose-light`,
  steps: `${iconWellBase} bg-card border-primary-200`,
  activity: `${iconWellBase} bg-card border-sage-mist`,
  hrv: `${iconWellBase} bg-card border-lavender`,
  sleep: `${iconWellBase} bg-card border-apricot`,
  period: `${iconWellBase} bg-primary-500 border-primary-400`,
  symptoms: `${iconWellBase} bg-lavender border-lavender-light`,
  mood: `${iconWellBase} bg-apricot border-apricot-light`,
  sparkle: `${iconWellBase} bg-primary-500 border-primary-400`,
  calendar: `${iconWellBase} bg-lavender-light border-lavender`,
  insight: `${iconWellBase} bg-card border-white`,
} as const;

export const DASHBOARD_QUICK_ACTION_SURFACE = {
  period: `${tintedTile} border-primary-200 bg-primary-50`,
  symptoms: `${tintedTile} border-lavender bg-lavender-light`,
  mood: `${tintedTile} border-apricot bg-apricot-light`,
} as const;

export const DASHBOARD_INSIGHT_SURFACE = {
  mrs: `${tintedTile} border-dusty-rose bg-dusty-rose-light`,
  sleep: `${tintedTile} border-lavender bg-lavender-light`,
  heat: `${tintedTile} border-apricot bg-apricot-light`,
} as const;
