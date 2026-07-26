/**
 * Industry-standard calendar cycle phase estimate.
 * Day 1 = first day of bleeding. Ovulation ≈ cycleLength − 14 (fixed luteal).
 * Not a clinical diagnosis.
 */

export const CYCLE_PHASE = {
  period: 'period',
  follicular: 'follicular',
  ovulation: 'ovulation',
  luteal: 'luteal',
} as const;

export type CyclePhase = (typeof CYCLE_PHASE)[keyof typeof CYCLE_PHASE];

export const DEFAULT_CYCLE_LENGTH_DAYS = 28;
export const DEFAULT_PERIOD_LENGTH_DAYS = 5;
export const LUTEAL_PHASE_LENGTH_DAYS = 14;
export const MIN_CYCLE_LENGTH_DAYS = 21;
export const MAX_CYCLE_LENGTH_DAYS = 35;
export const MIN_PERIOD_LENGTH_DAYS = 2;
export const MAX_PERIOD_LENGTH_DAYS = 10;
/** Inclusive radius around ovulation day (e.g. 1 → 3-day window). */
export const OVULATION_WINDOW_RADIUS_DAYS = 1;

export type PeriodCluster = {
  startDateKey: string;
  endDateKey: string;
  lengthDays: number;
};

export type CyclePhaseSnapshot = {
  phase: CyclePhase | null;
  cycleDay: number | null;
  cycleLengthDays: number;
  periodLengthDays: number;
  ovulationDay: number | null;
  periodStartDateKey: string | null;
  nextPeriodDateKey: string | null;
  hasPeriodData: boolean;
};

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isDateKey = (value: string): boolean => DATE_KEY_PATTERN.test(value);

const parseDateKey = (dateKey: string): Date => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const toDateKey = (date: Date): string => date.toISOString().slice(0, 10);

const addDays = (dateKey: string, days: number): string => {
  const date = parseDateKey(dateKey);
  date.setUTCDate(date.getUTCDate() + days);
  return toDateKey(date);
};

const daysBetween = (startDateKey: string, endDateKey: string): number => {
  const start = parseDateKey(startDateKey).getTime();
  const end = parseDateKey(endDateKey).getTime();
  return Math.round((end - start) / 86_400_000);
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

/**
 * Groups consecutive YYYY-MM-DD keys into bleeding episodes.
 */
export const clusterPeriodDateKeys = (
  dateKeys: readonly string[],
): PeriodCluster[] => {
  const sorted = [...new Set(dateKeys.filter(isDateKey))].sort();

  if (sorted.length === 0) {
    return [];
  }

  const clusters: PeriodCluster[] = [];
  let clusterStart = sorted[0];
  let clusterEnd = sorted[0];

  for (let index = 1; index < sorted.length; index += 1) {
    const current = sorted[index];
    const gap = daysBetween(clusterEnd, current);

    if (gap === 1) {
      clusterEnd = current;
      continue;
    }

    clusters.push({
      startDateKey: clusterStart,
      endDateKey: clusterEnd,
      lengthDays: daysBetween(clusterStart, clusterEnd) + 1,
    });
    clusterStart = current;
    clusterEnd = current;
  }

  clusters.push({
    startDateKey: clusterStart,
    endDateKey: clusterEnd,
    lengthDays: daysBetween(clusterStart, clusterEnd) + 1,
  });

  return clusters;
};

const averageCycleLengthDays = (starts: readonly string[]): number => {
  if (starts.length < 2) {
    return DEFAULT_CYCLE_LENGTH_DAYS;
  }

  const recentStarts = starts.slice(-6);
  const gaps: number[] = [];

  for (let index = 1; index < recentStarts.length; index += 1) {
    const gap = daysBetween(recentStarts[index - 1], recentStarts[index]);

    if (gap >= MIN_CYCLE_LENGTH_DAYS && gap <= MAX_CYCLE_LENGTH_DAYS) {
      gaps.push(gap);
    }
  }

  if (gaps.length === 0) {
    return DEFAULT_CYCLE_LENGTH_DAYS;
  }

  const average = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
  return clamp(Math.round(average), MIN_CYCLE_LENGTH_DAYS, MAX_CYCLE_LENGTH_DAYS);
};

const resolvePhaseForCycleDay = (
  cycleDay: number,
  periodLengthDays: number,
  ovulationDay: number,
): CyclePhase => {
  if (cycleDay <= periodLengthDays) {
    return CYCLE_PHASE.period;
  }

  const ovulationStart = ovulationDay - OVULATION_WINDOW_RADIUS_DAYS;
  const ovulationEnd = ovulationDay + OVULATION_WINDOW_RADIUS_DAYS;

  if (cycleDay >= ovulationStart && cycleDay <= ovulationEnd) {
    return CYCLE_PHASE.ovulation;
  }

  if (cycleDay < ovulationStart) {
    return CYCLE_PHASE.follicular;
  }

  return CYCLE_PHASE.luteal;
};

export type CalculateCyclePhaseInput = {
  periodDateKeys: readonly string[];
  /** YYYY-MM-DD reference day (usually today in local or UTC calendar). */
  asOfDateKey: string;
};

/**
 * Estimates the current cycle phase from logged bleeding days.
 * Uses average cycle length from period starts when ≥2 starts exist; else 28.
 * Period length from the active bleed cluster; else 5.
 */
export const calculateCyclePhase = (
  input: CalculateCyclePhaseInput,
): CyclePhaseSnapshot => {
  const asOfDateKey = isDateKey(input.asOfDateKey)
    ? input.asOfDateKey
    : toDateKey(new Date());

  const clusters = clusterPeriodDateKeys(input.periodDateKeys);

  if (clusters.length === 0) {
    return {
      phase: null,
      cycleDay: null,
      cycleLengthDays: DEFAULT_CYCLE_LENGTH_DAYS,
      periodLengthDays: DEFAULT_PERIOD_LENGTH_DAYS,
      ovulationDay: DEFAULT_CYCLE_LENGTH_DAYS - LUTEAL_PHASE_LENGTH_DAYS,
      periodStartDateKey: null,
      nextPeriodDateKey: null,
      hasPeriodData: false,
    };
  }

  const starts = clusters.map((cluster) => cluster.startDateKey);
  const startsOnOrBeforeToday = starts.filter((start) => start <= asOfDateKey);

  if (startsOnOrBeforeToday.length === 0) {
    return {
      phase: null,
      cycleDay: null,
      cycleLengthDays: averageCycleLengthDays(starts),
      periodLengthDays: DEFAULT_PERIOD_LENGTH_DAYS,
      ovulationDay: null,
      periodStartDateKey: null,
      nextPeriodDateKey: null,
      hasPeriodData: true,
    };
  }

  const periodStartDateKey = startsOnOrBeforeToday[startsOnOrBeforeToday.length - 1];
  const activeCluster = clusters.find(
    (cluster) => cluster.startDateKey === periodStartDateKey,
  );

  const periodLengthDays = clamp(
    activeCluster?.lengthDays ?? DEFAULT_PERIOD_LENGTH_DAYS,
    MIN_PERIOD_LENGTH_DAYS,
    MAX_PERIOD_LENGTH_DAYS,
  );

  const cycleLengthDays = averageCycleLengthDays(startsOnOrBeforeToday);
  const ovulationDay = cycleLengthDays - LUTEAL_PHASE_LENGTH_DAYS;
  const rawCycleDay = daysBetween(periodStartDateKey, asOfDateKey) + 1;

  // If the user is past the predicted cycle without a new bleed, stay on luteal
  // of the open cycle (do not invent a phantom next period start).
  const cycleDay =
    rawCycleDay > cycleLengthDays ? cycleLengthDays : Math.max(1, rawCycleDay);

  const phase =
    rawCycleDay > cycleLengthDays
      ? CYCLE_PHASE.luteal
      : resolvePhaseForCycleDay(cycleDay, periodLengthDays, ovulationDay);

  return {
    phase,
    cycleDay,
    cycleLengthDays,
    periodLengthDays,
    ovulationDay,
    periodStartDateKey,
    nextPeriodDateKey: addDays(periodStartDateKey, cycleLengthDays),
    hasPeriodData: true,
  };
};
