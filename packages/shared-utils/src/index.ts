export { scale, verticalScale, moderateScale, clamp, BASE_WIDTH, BASE_HEIGHT } from './scale';

export {
  CYCLE_PHASE,
  DEFAULT_CYCLE_LENGTH_DAYS,
  DEFAULT_PERIOD_LENGTH_DAYS,
  LUTEAL_PHASE_LENGTH_DAYS,
  MIN_CYCLE_LENGTH_DAYS,
  MAX_CYCLE_LENGTH_DAYS,
  MIN_PERIOD_LENGTH_DAYS,
  MAX_PERIOD_LENGTH_DAYS,
  OVULATION_WINDOW_RADIUS_DAYS,
  clusterPeriodDateKeys,
  calculateCyclePhase,
} from './cyclePhase';

export type {
  CyclePhase,
  PeriodCluster,
  CyclePhaseSnapshot,
  CalculateCyclePhaseInput,
} from './cyclePhase';

export {
  CYCLE_DAY_MARKER,
  FERTILE_DAYS_BEFORE_OVULATION,
  buildCycleDayMarkers,
  getPrimaryCycleDayMarker,
  resolveStatusPhaseTone,
} from './cycleDayMarkers';

export type {
  CycleDayMarker,
  BuildCycleDayMarkersInput,
} from './cycleDayMarkers';

export {
  PATTERN_WINDOW_DAYS,
  PATTERN_MIN_OVERLAP_DAYS,
  PATTERN_HRV_BASELINE_NIGHTS,
  PATTERN_STATUS,
  PATTERN_CONTEXT_ID,
  PATTERN_AXIS_ID,
  computePatterns,
} from './patterns/computePatterns';

export type {
  PatternStatus,
  PatternContextId,
  PatternAxisId,
  PatternDailyHealth,
  PatternDailyMood,
  PatternDailySymptoms,
  PatternSparkPoint,
  PatternContextResult,
  PatternAxisResult,
  PatternHeatmapCell,
  PatternHeatmapRow,
  PatternHeatmapResult,
  ComputePatternsInput,
  PatternsComputation,
} from './patterns/computePatterns';
