import {
  clusterPeriodDateKeys,
  type PeriodCluster,
} from '@syna/shared-utils';

import { addDaysToKey, isDateKey } from '@/lib/date/dateKeys';

const eachDateKeyInclusive = (fromDateKey: string, toDateKey: string): string[] => {
  if (!isDateKey(fromDateKey) || !isDateKey(toDateKey) || fromDateKey > toDateKey) {
    return [];
  }

  const keys: string[] = [];
  let cursor = fromDateKey;

  while (cursor <= toDateKey) {
    keys.push(cursor);
    cursor = addDaysToKey(cursor, 1);
  }

  return keys;
};

/**
 * Latest period cluster whose start is on or before asOfDateKey.
 * Matches cycle-phase math for the “active” bleed episode.
 */
export const findActivePeriodCluster = (
  dateKeys: readonly string[],
  asOfDateKey: string,
): PeriodCluster | null => {
  if (!isDateKey(asOfDateKey)) {
    return null;
  }

  const clusters = clusterPeriodDateKeys(dateKeys);
  const eligible = clusters.filter((cluster) => cluster.startDateKey <= asOfDateKey);

  if (eligible.length === 0) {
    return null;
  }

  return eligible[eligible.length - 1] ?? null;
};

export type ApplyPeriodEndResult = {
  nextDateKeys: Set<string>;
  cluster: PeriodCluster;
  filledDayCount: number;
};

/**
 * Rewrites the active bleed cluster so it runs start → endDateKey inclusive,
 * filling gaps and trimming days after the chosen last bleed day.
 * Other clusters are left untouched.
 */
export const applyPeriodEndDate = (
  dateKeys: ReadonlySet<string>,
  endDateKey: string,
  asOfDateKey: string,
): ApplyPeriodEndResult | null => {
  if (!isDateKey(endDateKey)) {
    return null;
  }

  const cluster = findActivePeriodCluster([...dateKeys], asOfDateKey);

  if (!cluster) {
    return null;
  }

  if (endDateKey < cluster.startDateKey) {
    return null;
  }

  const nextDateKeys = new Set(dateKeys);
  const previousClusterDays = eachDateKeyInclusive(
    cluster.startDateKey,
    cluster.endDateKey,
  );

  for (const dateKey of previousClusterDays) {
    nextDateKeys.delete(dateKey);
  }

  const filledDays = eachDateKeyInclusive(cluster.startDateKey, endDateKey);

  for (const dateKey of filledDays) {
    nextDateKeys.add(dateKey);
  }

  return {
    nextDateKeys,
    cluster,
    filledDayCount: filledDays.length,
  };
};

export const countDaysInclusive = (fromDateKey: string, toDateKey: string): number =>
  eachDateKeyInclusive(fromDateKey, toDateKey).length;
