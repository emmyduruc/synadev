/**
 * Sleep-stage + night-HR helpers for HealthKit / Health Connect raw samples.
 * Values are hours (sleep stages) or bpm (night HR). Never invents missing stages.
 */

import { toDateKey } from '@/lib/date/dateKeys';

/** Apple HealthKit CategoryValueSleepAnalysis */
const HK_SLEEP = {
  inBed: 0,
  asleepUnspecified: 1,
  awake: 2,
  asleepCore: 3,
  asleepDeep: 4,
  asleepRem: 5,
} as const;

/** Android Health Connect SleepStageType */
const HC_SLEEP = {
  unknown: 0,
  awake: 1,
  sleeping: 2,
  outOfBed: 3,
  light: 4,
  deep: 5,
  rem: 6,
} as const;

export type SleepInterval = {
  startMs: number;
  endMs: number;
  /** Calendar day attributed to this sleep bout (wake date). */
  dateKey: string;
};

export type SleepDayTotals = {
  totalHours: number;
  deepHours: number;
  remHours: number;
  lightHours: number;
};

type DayTotalsAccumulator = {
  totalMinutes: number;
  deepMinutes: number;
  remMinutes: number;
  lightMinutes: number;
};

const toDate = (value: unknown): Date | null => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
};

const durationMinutes = (start: Date, end: Date): number => {
  const minutes = (end.getTime() - start.getTime()) / 60_000;
  return minutes > 0 ? minutes : 0;
};

const ensureDayTotals = (
  byDay: Map<string, DayTotalsAccumulator>,
  dateKey: string,
): DayTotalsAccumulator => {
  const existing = byDay.get(dateKey);

  if (existing) {
    return existing;
  }

  const created: DayTotalsAccumulator = {
    totalMinutes: 0,
    deepMinutes: 0,
    remMinutes: 0,
    lightMinutes: 0,
  };
  byDay.set(dateKey, created);
  return created;
};

const toSleepDayTotalsMap = (
  byDay: Map<string, DayTotalsAccumulator>,
): Map<string, SleepDayTotals> => {
  const result = new Map<string, SleepDayTotals>();

  for (const [dateKey, acc] of byDay.entries()) {
    result.set(dateKey, {
      totalHours: acc.totalMinutes / 60,
      deepHours: acc.deepMinutes / 60,
      remHours: acc.remMinutes / 60,
      lightHours: acc.lightMinutes / 60,
    });
  }

  return result;
};

const isHealthKitAsleepValue = (value: number): boolean =>
  value === HK_SLEEP.asleepUnspecified ||
  value === HK_SLEEP.asleepCore ||
  value === HK_SLEEP.asleepDeep ||
  value === HK_SLEEP.asleepRem;

/**
 * Parse Apple Health Sleep Analysis category samples into per-wake-day totals
 * and asleep intervals (for night HR).
 */
export const aggregateHealthKitSleep = (
  records: readonly unknown[],
): { byDay: Map<string, SleepDayTotals>; intervals: SleepInterval[] } => {
  const byDay = new Map<string, DayTotalsAccumulator>();
  const intervals: SleepInterval[] = [];

  for (const record of records) {
    if (typeof record !== 'object' || record === null) {
      continue;
    }

    const typed = record as Record<string, unknown>;
    const start = toDate(typed.startDate);
    const end = toDate(typed.endDate);
    let value: number | null = null;

    if (typeof typed.value === 'number') {
      value = typed.value;
    } else if (typeof typed.value === 'string') {
      value = Number(typed.value);
    }

    if (!start || !end || value === null || Number.isNaN(value)) {
      continue;
    }

    const minutes = durationMinutes(start, end);

    if (minutes <= 0) {
      continue;
    }

    if (!isHealthKitAsleepValue(value)) {
      continue;
    }

    const dateKey = toDateKey(end);
    const day = ensureDayTotals(byDay, dateKey);
    day.totalMinutes += minutes;

    if (value === HK_SLEEP.asleepDeep) {
      day.deepMinutes += minutes;
    } else if (value === HK_SLEEP.asleepRem) {
      day.remMinutes += minutes;
    } else if (value === HK_SLEEP.asleepCore) {
      day.lightMinutes += minutes;
    }

    intervals.push({
      startMs: start.getTime(),
      endMs: end.getTime(),
      dateKey,
    });
  }

  return { byDay: toSleepDayTotalsMap(byDay), intervals };
};

const isHealthConnectAsleepStage = (stage: number): boolean =>
  stage === HC_SLEEP.sleeping ||
  stage === HC_SLEEP.light ||
  stage === HC_SLEEP.deep ||
  stage === HC_SLEEP.rem;

/**
 * Parse Health Connect SleepSession records (optional stages[]) into per-day totals.
 */
export const aggregateHealthConnectSleep = (
  records: readonly unknown[],
): { byDay: Map<string, SleepDayTotals>; intervals: SleepInterval[] } => {
  const byDay = new Map<string, DayTotalsAccumulator>();
  const intervals: SleepInterval[] = [];

  for (const record of records) {
    if (typeof record !== 'object' || record === null) {
      continue;
    }

    const typed = record as Record<string, unknown>;
    const sessionStart = toDate(typed.startTime);
    const sessionEnd = toDate(typed.endTime);

    if (!sessionStart || !sessionEnd) {
      continue;
    }

    const dateKey = toDateKey(sessionEnd);
    const stages = Array.isArray(typed.stages) ? typed.stages : null;

    if (stages && stages.length > 0) {
      for (const stageRecord of stages) {
        if (typeof stageRecord !== 'object' || stageRecord === null) {
          continue;
        }

        const stageTyped = stageRecord as Record<string, unknown>;
        const start = toDate(stageTyped.startTime);
        const end = toDate(stageTyped.endTime);
        const stage =
          typeof stageTyped.stage === 'number' ? stageTyped.stage : null;

        if (!start || !end || stage === null) {
          continue;
        }

        const minutes = durationMinutes(start, end);

        if (minutes <= 0 || !isHealthConnectAsleepStage(stage)) {
          continue;
        }

        const day = ensureDayTotals(byDay, dateKey);
        day.totalMinutes += minutes;

        if (stage === HC_SLEEP.deep) {
          day.deepMinutes += minutes;
        } else if (stage === HC_SLEEP.rem) {
          day.remMinutes += minutes;
        } else if (stage === HC_SLEEP.light) {
          day.lightMinutes += minutes;
        }

        intervals.push({
          startMs: start.getTime(),
          endMs: end.getTime(),
          dateKey,
        });
      }

      continue;
    }

    // No stages: count whole session as asleep (device did not provide staging).
    const minutes = durationMinutes(sessionStart, sessionEnd);

    if (minutes <= 0) {
      continue;
    }

    const day = ensureDayTotals(byDay, dateKey);
    day.totalMinutes += minutes;
    intervals.push({
      startMs: sessionStart.getTime(),
      endMs: sessionEnd.getTime(),
      dateKey,
    });
  }

  return { byDay: toSleepDayTotalsMap(byDay), intervals };
};

const extractHeartRateBpm = (record: unknown): { bpm: number; atMs: number }[] => {
  if (typeof record !== 'object' || record === null) {
    return [];
  }

  const typed = record as Record<string, unknown>;

  // Health Connect HeartRate records nest samples[].
  if (Array.isArray(typed.samples)) {
    const points: { bpm: number; atMs: number }[] = [];

    for (const sample of typed.samples) {
      if (typeof sample !== 'object' || sample === null) {
        continue;
      }

      const sampleTyped = sample as Record<string, unknown>;
      const bpm =
        typeof sampleTyped.beatsPerMinute === 'number'
          ? sampleTyped.beatsPerMinute
          : null;
      const at = toDate(sampleTyped.time);

      if (bpm !== null && Number.isFinite(bpm) && bpm > 0 && at) {
        points.push({ bpm, atMs: at.getTime() });
      }
    }

    return points;
  }

  // HealthKit quantity samples: quantity + startDate.
  let bpm: number | null = null;

  if (typeof typed.quantity === 'number') {
    bpm = typed.quantity;
  } else if (typeof typed.beatsPerMinute === 'number') {
    bpm = typed.beatsPerMinute;
  }

  const at =
    toDate(typed.startDate) ?? toDate(typed.startTime) ?? toDate(typed.date);

  if (bpm !== null && Number.isFinite(bpm) && bpm > 0 && at) {
    return [{ bpm, atMs: at.getTime() }];
  }

  return [];
};

const isInsideAnyInterval = (atMs: number, intervals: readonly SleepInterval[]): boolean => {
  for (const interval of intervals) {
    if (atMs >= interval.startMs && atMs <= interval.endMs) {
      return true;
    }
  }

  return false;
};

const findIntervalDateKey = (
  atMs: number,
  intervals: readonly SleepInterval[],
): string | null => {
  for (const interval of intervals) {
    if (atMs >= interval.startMs && atMs <= interval.endMs) {
      return interval.dateKey;
    }
  }

  return null;
};

/**
 * Average heart-rate samples that fall inside sleep intervals, per wake day.
 */
export const averageNightHeartRateByDay = (
  heartRateRecords: readonly unknown[],
  intervals: readonly SleepInterval[],
): Map<string, number> => {
  const byDay = new Map<string, { sum: number; count: number }>();

  if (intervals.length === 0) {
    return new Map();
  }

  for (const record of heartRateRecords) {
    for (const point of extractHeartRateBpm(record)) {
      if (!isInsideAnyInterval(point.atMs, intervals)) {
        continue;
      }

      const dateKey = findIntervalDateKey(point.atMs, intervals);

      if (!dateKey) {
        continue;
      }

      const acc = byDay.get(dateKey) ?? { sum: 0, count: 0 };
      acc.sum += point.bpm;
      acc.count += 1;
      byDay.set(dateKey, acc);
    }
  }

  const result = new Map<string, number>();

  for (const [dateKey, acc] of byDay.entries()) {
    if (acc.count > 0) {
      result.set(dateKey, acc.sum / acc.count);
    }
  }

  return result;
};
