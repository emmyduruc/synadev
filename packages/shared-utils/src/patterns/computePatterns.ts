/**
 * Patterns correlation engine — on-read scoring from logs + health daily series.
 * Estimates only. Not a diagnostic tool.
 */

import { buildCycleDayMarkers, getPrimaryCycleDayMarker } from '../cycleDayMarkers';
import {
  calculateCyclePhase,
  CYCLE_PHASE,
  type CyclePhase,
} from '../cyclePhase';

export const PATTERN_WINDOW_DAYS = 28;
export const PATTERN_MIN_OVERLAP_DAYS = 7;
export const PATTERN_HRV_BASELINE_NIGHTS = 14;

export const PATTERN_STATUS = {
  recognized: 'recognized',
  emerging: 'emerging',
  needsMoreData: 'needs_more_data',
  locked: 'locked',
} as const;

export type PatternStatus = (typeof PATTERN_STATUS)[keyof typeof PATTERN_STATUS];

export const PATTERN_CONTEXT_ID = {
  sleepHeat: 'sleep_heat',
  movementSleep: 'movement_sleep',
  cycleMood: 'cycle_mood',
  stressEnergy: 'stress_energy',
  hydrationBrainFog: 'hydration_brain_fog',
} as const;

export type PatternContextId =
  (typeof PATTERN_CONTEXT_ID)[keyof typeof PATTERN_CONTEXT_ID];

export const PATTERN_AXIS_ID = {
  exhaustion: 'exhaustion',
  overload: 'overload',
  cycleStress: 'cycle_stress',
} as const;

export type PatternAxisId = (typeof PATTERN_AXIS_ID)[keyof typeof PATTERN_AXIS_ID];

export type PatternDailyHealth = {
  dateKey: string;
  steps: number | null;
  exerciseMinutes: number | null;
  sleepHours: number | null;
  hrvMs: number | null;
  restingHr: number | null;
};

export type PatternDailyMood = {
  dateKey: string;
  energy: number | null;
  stress: number | null;
  isChallenging: boolean;
};

export type PatternDailySymptoms = {
  dateKey: string;
  symptomIds: readonly string[];
};

export type PatternSparkPoint = {
  dateKey: string;
  value: number | null;
};

export type PatternContextResult = {
  id: PatternContextId;
  status: PatternStatus;
  strength: number;
  supportingDayCount: number;
  overallContextCount: number;
  titleKey: string;
  summaryKey: string;
  learnMoreKey: string;
  sparklineA: PatternSparkPoint[];
  sparklineB: PatternSparkPoint[];
  isDiagnostic: false;
};

export type PatternAxisResult = {
  id: PatternAxisId;
  status: PatternStatus;
  strength: number;
  supportingDayCount: number;
  titleKey: string;
  summaryKey: string;
  isDiagnostic: false;
};

export type PatternHeatmapCell = {
  dateKey: string;
  logged: boolean;
  marker: string | null;
};

export type PatternHeatmapRow = {
  symptomId: string;
  cells: PatternHeatmapCell[];
};

export type PatternHeatmapResult = {
  dateKeys: string[];
  rows: PatternHeatmapRow[];
  hasPeriodData: boolean;
  isEmpty: boolean;
};

export type ComputePatternsInput = {
  asOfDateKey: string;
  periodDateKeys: readonly string[];
  symptomsByDate: ReadonlyMap<string, readonly string[]>;
  moodsByDate: ReadonlyMap<string, PatternDailyMood>;
  healthByDate: ReadonlyMap<string, PatternDailyHealth>;
  windowDays?: number;
};

export type PatternsComputation = {
  windowStartDateKey: string;
  windowEndDateKey: string;
  contexts: PatternContextResult[];
  axes: PatternAxisResult[];
  heatmap: PatternHeatmapResult;
  recognizedContextCount: number;
  isDiagnostic: false;
};

const HEATMAP_SYMPTOM_IDS = [
  'hot_flashes',
  'night_sweats',
  'brain_fog',
  'fatigue',
  'insomnia',
  'irritable',
  'anxious',
  'joint_muscle_pain',
] as const;

const CHALLENGING_MOOD_HINT = true;

const addDays = (dateKey: string, days: number): string => {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const eachDateKey = (fromDateKey: string, toDateKey: string): string[] => {
  if (fromDateKey > toDateKey) {
    return [];
  }

  const keys: string[] = [];
  let cursor = fromDateKey;

  while (cursor <= toDateKey) {
    keys.push(cursor);
    cursor = addDays(cursor, 1);
  }

  return keys;
};

const mean = (values: number[]): number | null => {
  if (values.length === 0) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const stdDev = (values: number[]): number | null => {
  if (values.length < 2) {
    return null;
  }

  const avg = mean(values);

  if (avg === null) {
    return null;
  }

  const variance =
    values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
};

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const pearson = (xs: number[], ys: number[]): number | null => {
  if (xs.length < PATTERN_MIN_OVERLAP_DAYS || xs.length !== ys.length) {
    return null;
  }

  const meanX = mean(xs);
  const meanY = mean(ys);

  if (meanX === null || meanY === null) {
    return null;
  }

  let num = 0;
  let denX = 0;
  let denY = 0;

  for (let index = 0; index < xs.length; index += 1) {
    const dx = xs[index] - meanX;
    const dy = ys[index] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }

  if (denX === 0 || denY === 0) {
    return null;
  }

  return num / Math.sqrt(denX * denY);
};

const statusFromStrength = (
  strength: number,
  supportingDayCount: number,
): PatternStatus => {
  if (supportingDayCount < PATTERN_MIN_OVERLAP_DAYS) {
    return PATTERN_STATUS.needsMoreData;
  }

  if (strength >= 0.45) {
    return PATTERN_STATUS.recognized;
  }

  if (strength >= 0.25) {
    return PATTERN_STATUS.emerging;
  }

  return PATTERN_STATUS.needsMoreData;
};

const hasSymptom = (
  symptomsByDate: ReadonlyMap<string, readonly string[]>,
  dateKey: string,
  ids: readonly string[],
): boolean => {
  const logged = symptomsByDate.get(dateKey) ?? [];
  return ids.some((id) => logged.includes(id));
};

const resolvePhaseForDay = (
  periodDateKeys: readonly string[],
  dateKey: string,
): CyclePhase | null => {
  const snapshot = calculateCyclePhase({
    periodDateKeys,
    asOfDateKey: dateKey,
  });
  return snapshot.phase;
};

const buildSpark = (
  dateKeys: readonly string[],
  values: ReadonlyMap<string, number | null>,
): PatternSparkPoint[] =>
  dateKeys.map((dateKey) => ({
    dateKey,
    value: values.get(dateKey) ?? null,
  }));

const computeSleepHeat = (
  dateKeys: readonly string[],
  symptomsByDate: ReadonlyMap<string, readonly string[]>,
  healthByDate: ReadonlyMap<string, PatternDailyHealth>,
  recognizedContextCount: number,
): PatternContextResult => {
  const sleepByDay = new Map<string, number | null>();
  const heatByDay = new Map<string, number | null>();
  const xs: number[] = [];
  const ys: number[] = [];

  for (const dateKey of dateKeys) {
    const sleep = healthByDate.get(dateKey)?.sleepHours ?? null;
    const nextKey = addDays(dateKey, 1);
    const heatToday = hasSymptom(symptomsByDate, dateKey, [
      'hot_flashes',
      'night_sweats',
    ]);
    const heatNext = hasSymptom(symptomsByDate, nextKey, [
      'hot_flashes',
      'night_sweats',
    ]);
    const heatScore = heatToday || heatNext ? 1 : 0;

    sleepByDay.set(dateKey, sleep);
    heatByDay.set(dateKey, heatScore);

    if (sleep !== null) {
      xs.push(sleep);
      ys.push(heatScore);
    }
  }

  const correlation = pearson(xs, ys);
  // Low sleep with heat → negative correlation expected; strength = |r|
  const strength = correlation === null ? 0 : clamp01(Math.abs(correlation));
  const supportingDayCount = xs.length;

  return {
    id: PATTERN_CONTEXT_ID.sleepHeat,
    status: statusFromStrength(strength, supportingDayCount),
    strength,
    supportingDayCount,
    overallContextCount: recognizedContextCount,
    titleKey: 'patterns_context_sleep_heat_title',
    summaryKey: 'patterns_context_sleep_heat_summary',
    learnMoreKey: 'patterns_context_sleep_heat_learn_more',
    sparklineA: buildSpark(dateKeys, sleepByDay),
    sparklineB: buildSpark(dateKeys, heatByDay),
    isDiagnostic: false,
  };
};

const computeMovementSleep = (
  dateKeys: readonly string[],
  healthByDate: ReadonlyMap<string, PatternDailyHealth>,
  recognizedContextCount: number,
): PatternContextResult => {
  const moveByDay = new Map<string, number | null>();
  const sleepByDay = new Map<string, number | null>();
  const xs: number[] = [];
  const ys: number[] = [];

  for (const dateKey of dateKeys) {
    const health = healthByDate.get(dateKey);
    const movement =
      health?.exerciseMinutes ??
      (health?.steps !== null && health?.steps !== undefined
        ? health.steps / 1000
        : null);
    const nextSleep = healthByDate.get(addDays(dateKey, 1))?.sleepHours ?? null;

    moveByDay.set(dateKey, movement);
    sleepByDay.set(dateKey, nextSleep);

    if (movement !== null && nextSleep !== null) {
      xs.push(movement);
      ys.push(nextSleep);
    }
  }

  const correlation = pearson(xs, ys);
  const strength = correlation === null ? 0 : clamp01(Math.abs(correlation));
  const supportingDayCount = xs.length;

  return {
    id: PATTERN_CONTEXT_ID.movementSleep,
    status: statusFromStrength(strength, supportingDayCount),
    strength,
    supportingDayCount,
    overallContextCount: recognizedContextCount,
    titleKey: 'patterns_context_movement_sleep_title',
    summaryKey: 'patterns_context_movement_sleep_summary',
    learnMoreKey: 'patterns_context_movement_sleep_learn_more',
    sparklineA: buildSpark(dateKeys, moveByDay),
    sparklineB: buildSpark(dateKeys, sleepByDay),
    isDiagnostic: false,
  };
};

const computeCycleMood = (
  dateKeys: readonly string[],
  periodDateKeys: readonly string[],
  moodsByDate: ReadonlyMap<string, PatternDailyMood>,
  recognizedContextCount: number,
): PatternContextResult => {
  const stressByDay = new Map<string, number | null>();
  const energyByDay = new Map<string, number | null>();
  const byPhase = new Map<CyclePhase, number[]>();

  for (const dateKey of dateKeys) {
    const mood = moodsByDate.get(dateKey);
    const stress = mood?.stress ?? null;
    const energy = mood?.energy ?? null;
    stressByDay.set(dateKey, stress);
    energyByDay.set(dateKey, energy);

    const phase = resolvePhaseForDay(periodDateKeys, dateKey);

    if (phase && stress !== null) {
      const list = byPhase.get(phase) ?? [];
      list.push(stress);
      byPhase.set(phase, list);
    }
  }

  const luteal = mean(byPhase.get(CYCLE_PHASE.luteal) ?? []);
  const period = mean(byPhase.get(CYCLE_PHASE.period) ?? []);
  const follicular = mean(byPhase.get(CYCLE_PHASE.follicular) ?? []);
  const baseline = follicular ?? mean([...(byPhase.values())].flat());
  const elevated = luteal ?? period;

  let strength = 0;
  let supportingDayCount = 0;

  for (const values of byPhase.values()) {
    supportingDayCount += values.length;
  }

  if (baseline !== null && elevated !== null && supportingDayCount >= PATTERN_MIN_OVERLAP_DAYS) {
    strength = clamp01((elevated - baseline) / 5);
  }

  return {
    id: PATTERN_CONTEXT_ID.cycleMood,
    status: statusFromStrength(strength, supportingDayCount),
    strength,
    supportingDayCount,
    overallContextCount: recognizedContextCount,
    titleKey: 'patterns_context_cycle_mood_title',
    summaryKey: 'patterns_context_cycle_mood_summary',
    learnMoreKey: 'patterns_context_cycle_mood_learn_more',
    sparklineA: buildSpark(dateKeys, stressByDay),
    sparklineB: buildSpark(dateKeys, energyByDay),
    isDiagnostic: false,
  };
};

const computeStressEnergy = (
  dateKeys: readonly string[],
  moodsByDate: ReadonlyMap<string, PatternDailyMood>,
  healthByDate: ReadonlyMap<string, PatternDailyHealth>,
  recognizedContextCount: number,
): PatternContextResult => {
  const stressByDay = new Map<string, number | null>();
  const energyByDay = new Map<string, number | null>();
  const xs: number[] = [];
  const ys: number[] = [];

  for (const dateKey of dateKeys) {
    const mood = moodsByDate.get(dateKey);
    const stress = mood?.stress ?? null;
    const energy = mood?.energy ?? null;
    stressByDay.set(dateKey, stress);
    energyByDay.set(dateKey, energy);

    if (stress !== null && energy !== null) {
      xs.push(stress);
      ys.push(energy);
    } else if (stress !== null && healthByDate.get(dateKey)?.hrvMs !== null) {
      // Optional HRV as energy proxy when mood energy missing is skipped for accuracy
    }
  }

  const correlation = pearson(xs, ys);
  // Stress up, energy down → negative r; strength = |r|
  const strength = correlation === null ? 0 : clamp01(Math.abs(correlation));
  const supportingDayCount = xs.length;

  return {
    id: PATTERN_CONTEXT_ID.stressEnergy,
    status: statusFromStrength(strength, supportingDayCount),
    strength,
    supportingDayCount,
    overallContextCount: recognizedContextCount,
    titleKey: 'patterns_context_stress_energy_title',
    summaryKey: 'patterns_context_stress_energy_summary',
    learnMoreKey: 'patterns_context_stress_energy_learn_more',
    sparklineA: buildSpark(dateKeys, stressByDay),
    sparklineB: buildSpark(dateKeys, energyByDay),
    isDiagnostic: false,
  };
};

const lockedHydrationContext = (
  dateKeys: readonly string[],
  recognizedContextCount: number,
): PatternContextResult => ({
  id: PATTERN_CONTEXT_ID.hydrationBrainFog,
  status: PATTERN_STATUS.locked,
  strength: 0,
  supportingDayCount: 0,
  overallContextCount: recognizedContextCount,
  titleKey: 'patterns_context_hydration_brain_fog_title',
  summaryKey: 'patterns_context_hydration_brain_fog_summary',
  learnMoreKey: 'patterns_context_hydration_brain_fog_learn_more',
  sparklineA: dateKeys.map((dateKey) => ({ dateKey, value: null })),
  sparklineB: dateKeys.map((dateKey) => ({ dateKey, value: null })),
  isDiagnostic: false,
});

const zScore = (value: number, values: number[]): number | null => {
  const avg = mean(values);
  const sd = stdDev(values);

  if (avg === null || sd === null || sd === 0) {
    return null;
  }

  return (value - avg) / sd;
};

const computeExhaustionAxis = (
  dateKeys: readonly string[],
  symptomsByDate: ReadonlyMap<string, readonly string[]>,
  moodsByDate: ReadonlyMap<string, PatternDailyMood>,
  healthByDate: ReadonlyMap<string, PatternDailyHealth>,
): PatternAxisResult => {
  const sleepValues = dateKeys
    .map((key) => healthByDate.get(key)?.sleepHours)
    .filter((value): value is number => value !== null && value !== undefined);
  const hrvValues = dateKeys
    .map((key) => healthByDate.get(key)?.hrvMs)
    .filter((value): value is number => value !== null && value !== undefined);

  let hitDays = 0;

  for (const dateKey of dateKeys.slice(-7)) {
    const sleep = healthByDate.get(dateKey)?.sleepHours ?? null;
    const hrv = healthByDate.get(dateKey)?.hrvMs ?? null;
    const energy = moodsByDate.get(dateKey)?.energy ?? null;
    const fatigued = hasSymptom(symptomsByDate, dateKey, ['fatigue', 'insomnia']);

    const lowSleep = sleep !== null && sleepValues.length >= 7 && sleep < (mean(sleepValues) ?? 7);
    const lowHrv =
      hrv !== null &&
      hrvValues.length >= PATTERN_HRV_BASELINE_NIGHTS &&
      (zScore(hrv, hrvValues) ?? 0) <= -0.5;
    const lowEnergy = energy !== null && energy <= 2;

    if ((lowSleep || lowHrv) && (lowEnergy || fatigued)) {
      hitDays += 1;
    }
  }

  const supportingDayCount = Math.min(dateKeys.length, 7);
  const strength = clamp01(hitDays / 3);

  const status = (() => {
    if (hitDays >= 3) {
      return PATTERN_STATUS.recognized;
    }

    if (hitDays >= 1) {
      return PATTERN_STATUS.emerging;
    }

    return PATTERN_STATUS.needsMoreData;
  })();

  return {
    id: PATTERN_AXIS_ID.exhaustion,
    status,
    strength,
    supportingDayCount,
    titleKey: 'patterns_axis_exhaustion_title',
    summaryKey: 'patterns_axis_exhaustion_summary',
    isDiagnostic: false,
  };
};

const computeOverloadAxis = (
  dateKeys: readonly string[],
  moodsByDate: ReadonlyMap<string, PatternDailyMood>,
): PatternAxisResult => {
  let hitDays = 0;

  for (const dateKey of dateKeys.slice(-7)) {
    const mood = moodsByDate.get(dateKey);

    if (!mood) {
      continue;
    }

    const highStress = mood.stress !== null && mood.stress >= 3;
    const lowEnergy = mood.energy !== null && mood.energy <= 2;
    const challenging = mood.isChallenging === CHALLENGING_MOOD_HINT;

    if (highStress && lowEnergy && challenging) {
      hitDays += 1;
    }
  }

  const strength = clamp01(hitDays / 3);

  const status = (() => {
    if (hitDays >= 3) {
      return PATTERN_STATUS.recognized;
    }

    if (hitDays >= 1) {
      return PATTERN_STATUS.emerging;
    }

    return PATTERN_STATUS.needsMoreData;
  })();

  return {
    id: PATTERN_AXIS_ID.overload,
    status,
    strength,
    supportingDayCount: Math.min(dateKeys.length, 7),
    titleKey: 'patterns_axis_overload_title',
    summaryKey: 'patterns_axis_overload_summary',
    isDiagnostic: false,
  };
};

const computeCycleStressAxis = (
  dateKeys: readonly string[],
  periodDateKeys: readonly string[],
  moodsByDate: ReadonlyMap<string, PatternDailyMood>,
  symptomsByDate: ReadonlyMap<string, readonly string[]>,
): PatternAxisResult => {
  const lutealStress: number[] = [];
  const follicularStress: number[] = [];
  let supportingDayCount = 0;

  for (const dateKey of dateKeys) {
    const phase = resolvePhaseForDay(periodDateKeys, dateKey);
    const stress = moodsByDate.get(dateKey)?.stress;
    const heavySymptoms = hasSymptom(symptomsByDate, dateKey, [
      'irritable',
      'anxious',
      'hot_flashes',
    ]);

    if (!phase) {
      continue;
    }

    supportingDayCount += 1;
    const score = (stress ?? (heavySymptoms ? 3 : 0));

    if (phase === CYCLE_PHASE.luteal || phase === CYCLE_PHASE.period) {
      lutealStress.push(score);
    }

    if (phase === CYCLE_PHASE.follicular) {
      follicularStress.push(score);
    }
  }

  const lutealMean = mean(lutealStress);
  const follicularMean = mean(follicularStress);
  let strength = 0;

  if (lutealMean !== null && follicularMean !== null) {
    strength = clamp01((lutealMean - follicularMean) / 5);
  }

  return {
    id: PATTERN_AXIS_ID.cycleStress,
    status: statusFromStrength(strength, supportingDayCount),
    strength,
    supportingDayCount,
    titleKey: 'patterns_axis_cycle_stress_title',
    summaryKey: 'patterns_axis_cycle_stress_summary',
    isDiagnostic: false,
  };
};

const buildHeatmap = (
  dateKeys: readonly string[],
  periodDateKeys: readonly string[],
  symptomsByDate: ReadonlyMap<string, readonly string[]>,
): PatternHeatmapResult => {
  const hasPeriodData = periodDateKeys.length > 0;
  const markers = buildCycleDayMarkers({
    periodDateKeys,
    snapshot: calculateCyclePhase({
      periodDateKeys,
      asOfDateKey: dateKeys[dateKeys.length - 1] ?? dateKeys[0],
    }),
    fromDateKey: dateKeys[0],
    toDateKey: dateKeys[dateKeys.length - 1],
  });

  const frequency = new Map<string, number>();

  for (const dateKey of dateKeys) {
    for (const symptomId of symptomsByDate.get(dateKey) ?? []) {
      frequency.set(symptomId, (frequency.get(symptomId) ?? 0) + 1);
    }
  }

  const ranked = [...HEATMAP_SYMPTOM_IDS]
    .map((symptomId) => ({
      symptomId,
      count: frequency.get(symptomId) ?? 0,
    }))
    .sort((a, b) => b.count - a.count);

  const rows: PatternHeatmapRow[] = ranked.map(({ symptomId }) => ({
    symptomId,
    cells: dateKeys.map((dateKey) => ({
      dateKey,
      logged: (symptomsByDate.get(dateKey) ?? []).includes(symptomId),
      marker: getPrimaryCycleDayMarker(markers.get(dateKey)) ,
    })),
  }));

  const isEmpty = ![...frequency.values()].some((count) => count > 0);

  return {
    dateKeys: [...dateKeys],
    rows,
    hasPeriodData,
    isEmpty,
  };
};

/**
 * Computes Patterns view-model from aligned daily inputs (28-day default window).
 */
export const computePatterns = (input: ComputePatternsInput): PatternsComputation => {
  const windowDays = input.windowDays ?? PATTERN_WINDOW_DAYS;
  const windowEndDateKey = input.asOfDateKey;
  const windowStartDateKey = addDays(windowEndDateKey, -(windowDays - 1));
  const dateKeys = eachDateKey(windowStartDateKey, windowEndDateKey);

  const draftContexts = [
    computeSleepHeat(dateKeys, input.symptomsByDate, input.healthByDate, 0),
    computeMovementSleep(dateKeys, input.healthByDate, 0),
    computeCycleMood(dateKeys, input.periodDateKeys, input.moodsByDate, 0),
    computeStressEnergy(
      dateKeys,
      input.moodsByDate,
      input.healthByDate,
      0,
    ),
    lockedHydrationContext(dateKeys, 0),
  ];

  const recognizedContextCount = draftContexts.filter(
    (context) => context.status === PATTERN_STATUS.recognized,
  ).length;

  const contexts = draftContexts.map((context) => ({
    ...context,
    overallContextCount: recognizedContextCount,
  }));

  const axes = [
    computeExhaustionAxis(
      dateKeys,
      input.symptomsByDate,
      input.moodsByDate,
      input.healthByDate,
    ),
    computeOverloadAxis(dateKeys, input.moodsByDate),
    computeCycleStressAxis(
      dateKeys,
      input.periodDateKeys,
      input.moodsByDate,
      input.symptomsByDate,
    ),
  ];

  return {
    windowStartDateKey,
    windowEndDateKey,
    contexts,
    axes,
    heatmap: buildHeatmap(dateKeys, input.periodDateKeys, input.symptomsByDate),
    recognizedContextCount,
    isDiagnostic: false,
  };
};
