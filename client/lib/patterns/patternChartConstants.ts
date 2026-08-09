export const PATTERN_CHART_TYPE = {
  area: 'area',
  bar: 'bar',
} as const;

export type PatternChartType =
  (typeof PATTERN_CHART_TYPE)[keyof typeof PATTERN_CHART_TYPE];

export const PATTERN_CHART_METRIC = {
  sleep: 'sleep',
  steps: 'steps',
  exercise: 'exercise',
  hrv: 'hrv',
  stress: 'stress',
  energy: 'energy',
  heat: 'heat',
} as const;

export type PatternChartMetricId =
  (typeof PATTERN_CHART_METRIC)[keyof typeof PATTERN_CHART_METRIC];

export const PATTERN_CHART_METRIC_ORDER = [
  PATTERN_CHART_METRIC.sleep,
  PATTERN_CHART_METRIC.steps,
  PATTERN_CHART_METRIC.exercise,
  PATTERN_CHART_METRIC.hrv,
  PATTERN_CHART_METRIC.stress,
  PATTERN_CHART_METRIC.energy,
  PATTERN_CHART_METRIC.heat,
] as const;

export const PATTERN_CHART_METRIC_LABEL_KEY: Record<PatternChartMetricId, string> = {
  [PATTERN_CHART_METRIC.sleep]: 'patterns_chart_metric_sleep',
  [PATTERN_CHART_METRIC.steps]: 'patterns_chart_metric_steps',
  [PATTERN_CHART_METRIC.exercise]: 'patterns_chart_metric_exercise',
  [PATTERN_CHART_METRIC.hrv]: 'patterns_chart_metric_hrv',
  [PATTERN_CHART_METRIC.stress]: 'patterns_chart_metric_stress',
  [PATTERN_CHART_METRIC.energy]: 'patterns_chart_metric_energy',
  [PATTERN_CHART_METRIC.heat]: 'patterns_chart_metric_heat',
};

export const PATTERN_CHART_METRIC_UNIT_KEY: Record<PatternChartMetricId, string> = {
  [PATTERN_CHART_METRIC.sleep]: 'patterns_chart_unit_hours',
  [PATTERN_CHART_METRIC.steps]: 'patterns_chart_unit_steps',
  [PATTERN_CHART_METRIC.exercise]: 'patterns_chart_unit_minutes',
  [PATTERN_CHART_METRIC.hrv]: 'patterns_chart_unit_ms',
  [PATTERN_CHART_METRIC.stress]: 'patterns_chart_unit_scale',
  [PATTERN_CHART_METRIC.energy]: 'patterns_chart_unit_scale',
  [PATTERN_CHART_METRIC.heat]: 'patterns_chart_unit_logged',
};

/** Inclusive past days loaded for the scrollable timeline (API max is 90). */
export const PATTERN_CHART_LOOKBACK_DAYS = 90;

/** Empty future days after today so users can scroll forward. */
export const PATTERN_CHART_FUTURE_DAYS = 14;

/** Horizontal pixels per day in landscape graph mode. */
export const PATTERN_CHART_DAY_WIDTH = 34;
