/**
 * Per-day cycle calendar markers for UI overlays.
 * Estimates only — not contraception guidance.
 */

import {
  CYCLE_PHASE,
  OVULATION_WINDOW_RADIUS_DAYS,
  type CyclePhaseSnapshot,
} from './cyclePhase';

export const CYCLE_DAY_MARKER = {
  period: 'period',
  predictedPeriod: 'predicted_period',
  fertile: 'fertile',
  ovulation: 'ovulation',
} as const;

export type CycleDayMarker =
  (typeof CYCLE_DAY_MARKER)[keyof typeof CYCLE_DAY_MARKER];

/** Inclusive days before ovulation that count as the fertile window. */
export const FERTILE_DAYS_BEFORE_OVULATION = 5;

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isDateKey = (value: string): boolean => DATE_KEY_PATTERN.test(value);

const parseDateKey = (dateKey: string): Date => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const toDateKeyUtc = (date: Date): string => date.toISOString().slice(0, 10);

const addDays = (dateKey: string, days: number): string => {
  const date = parseDateKey(dateKey);
  date.setUTCDate(date.getUTCDate() + days);
  return toDateKeyUtc(date);
};

const daysBetween = (startDateKey: string, endDateKey: string): number => {
  const start = parseDateKey(startDateKey).getTime();
  const end = parseDateKey(endDateKey).getTime();
  return Math.round((end - start) / 86_400_000);
};

const eachDateKey = (fromDateKey: string, toDateKey: string): string[] => {
  if (!isDateKey(fromDateKey) || !isDateKey(toDateKey) || fromDateKey > toDateKey) {
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

export type BuildCycleDayMarkersInput = {
  periodDateKeys: readonly string[];
  snapshot: Pick<
    CyclePhaseSnapshot,
    | 'periodStartDateKey'
    | 'periodLengthDays'
    | 'cycleLengthDays'
    | 'ovulationDay'
    | 'nextPeriodDateKey'
    | 'hasPeriodData'
  >;
  fromDateKey: string;
  toDateKey: string;
};

/**
 * Builds a map of YYYY-MM-DD → markers for calendar / week UI.
 * Priority when multiple apply: period > ovulation > fertile > predicted_period.
 */
export const buildCycleDayMarkers = (
  input: BuildCycleDayMarkersInput,
): ReadonlyMap<string, readonly CycleDayMarker[]> => {
  const periodSet = new Set(input.periodDateKeys.filter(isDateKey));
  const result = new Map<string, CycleDayMarker[]>();

  const pushMarker = (dateKey: string, marker: CycleDayMarker) => {
    const existing = result.get(dateKey) ?? [];
    if (!existing.includes(marker)) {
      result.set(dateKey, [...existing, marker]);
    }
  };

  for (const dateKey of eachDateKey(input.fromDateKey, input.toDateKey)) {
    if (periodSet.has(dateKey)) {
      pushMarker(dateKey, CYCLE_DAY_MARKER.period);
    }
  }

  const { periodStartDateKey, ovulationDay, nextPeriodDateKey, periodLengthDays } =
    input.snapshot;

  if (periodStartDateKey && ovulationDay !== null) {
    const fertileStartDay = Math.max(1, ovulationDay - FERTILE_DAYS_BEFORE_OVULATION);
    const fertileEndDay = ovulationDay + OVULATION_WINDOW_RADIUS_DAYS;

    for (const dateKey of eachDateKey(input.fromDateKey, input.toDateKey)) {
      if (periodSet.has(dateKey)) {
        continue;
      }

      const cycleDay = daysBetween(periodStartDateKey, dateKey) + 1;

      if (cycleDay < 1 || cycleDay > input.snapshot.cycleLengthDays + 7) {
        continue;
      }

      if (cycleDay === ovulationDay) {
        pushMarker(dateKey, CYCLE_DAY_MARKER.ovulation);
      }

      if (cycleDay >= fertileStartDay && cycleDay <= fertileEndDay) {
        pushMarker(dateKey, CYCLE_DAY_MARKER.fertile);
      }
    }
  }

  if (nextPeriodDateKey && periodLengthDays > 0) {
    for (let offset = 0; offset < periodLengthDays; offset += 1) {
      const dateKey = addDays(nextPeriodDateKey, offset);

      if (dateKey < input.fromDateKey || dateKey > input.toDateKey) {
        continue;
      }

      if (periodSet.has(dateKey)) {
        continue;
      }

      pushMarker(dateKey, CYCLE_DAY_MARKER.predictedPeriod);
    }
  }

  return result;
};

export const getPrimaryCycleDayMarker = (
  markers: readonly CycleDayMarker[] | undefined,
): CycleDayMarker | null => {
  if (!markers || markers.length === 0) {
    return null;
  }

  if (markers.includes(CYCLE_DAY_MARKER.period)) {
    return CYCLE_DAY_MARKER.period;
  }

  if (markers.includes(CYCLE_DAY_MARKER.ovulation)) {
    return CYCLE_DAY_MARKER.ovulation;
  }

  if (markers.includes(CYCLE_DAY_MARKER.fertile)) {
    return CYCLE_DAY_MARKER.fertile;
  }

  if (markers.includes(CYCLE_DAY_MARKER.predictedPeriod)) {
    return CYCLE_DAY_MARKER.predictedPeriod;
  }

  return null;
};

export const resolveStatusPhaseTone = (
  phase: (typeof CYCLE_PHASE)[keyof typeof CYCLE_PHASE] | null,
): 'period' | 'fertile' | 'ovulation' | 'luteal' | 'unknown' => {
  if (phase === CYCLE_PHASE.period) {
    return 'period';
  }

  if (phase === CYCLE_PHASE.ovulation) {
    return 'ovulation';
  }

  if (phase === CYCLE_PHASE.follicular) {
    return 'fertile';
  }

  if (phase === CYCLE_PHASE.luteal) {
    return 'luteal';
  }

  return 'unknown';
};
