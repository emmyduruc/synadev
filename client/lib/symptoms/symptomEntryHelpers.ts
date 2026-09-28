import type { SymptomDayEntry, SymptomId, SymptomIntensity, SymptomLogMap } from '@syna/shared-types';

import { SYMPTOM_CATEGORIES, type SymptomOption } from '@/lib/symptoms/symptomCatalog';
import {
  DEFAULT_OFTEN_WITH_YOU_IDS,
  OFTEN_WITH_YOU_LIMIT,
  OFTEN_WITH_YOU_MIN_DAYS,
  PERSISTENT_COMPLAINT_MIN_DAYS,
} from '@/lib/symptoms/symptomEntryConstants';

export const symptomIdsFromDayEntries = (
  entries: readonly SymptomDayEntry[] | undefined,
): SymptomId[] => (entries ?? []).map((entry) => entry.symptomId);

export const findDayEntry = (
  entries: readonly SymptomDayEntry[] | undefined,
  symptomId: SymptomId,
): SymptomDayEntry | undefined => entries?.find((entry) => entry.symptomId === symptomId);

export const upsertDayEntry = (
  entries: readonly SymptomDayEntry[] | undefined,
  nextEntry: SymptomDayEntry,
): SymptomDayEntry[] => {
  const current = [...(entries ?? [])];
  const index = current.findIndex((entry) => entry.symptomId === nextEntry.symptomId);

  if (index >= 0) {
    current[index] = nextEntry;
  } else {
    current.push(nextEntry);
  }

  return current;
};

export const removeDayEntry = (
  entries: readonly SymptomDayEntry[] | undefined,
  symptomId: SymptomId,
): SymptomDayEntry[] => (entries ?? []).filter((entry) => entry.symptomId !== symptomId);

export const findSymptomOption = (symptomId: SymptomId): SymptomOption | undefined => {
  for (const category of SYMPTOM_CATEGORIES) {
    const option = category.options.find((item) => item.id === symptomId);

    if (option) {
      return option;
    }
  }

  return undefined;
};

const countSymptomDays = (logs: SymptomLogMap): Map<SymptomId, number> => {
  const counts = new Map<SymptomId, number>();

  for (const entries of Object.values(logs)) {
    const seen = new Set<SymptomId>();

    for (const entry of entries) {
      if (seen.has(entry.symptomId)) {
        continue;
      }

      seen.add(entry.symptomId);
      counts.set(entry.symptomId, (counts.get(entry.symptomId) ?? 0) + 1);
    }
  }

  return counts;
};

const rankByDayCount = (
  counts: Map<SymptomId, number>,
  minDays: number,
  limit?: number,
): SymptomId[] => {
  const ranked = [...counts.entries()]
    .filter(([, days]) => days >= minDays)
    .sort((a, b) => b[1] - a[1])
    .map(([symptomId]) => symptomId);

  if (typeof limit === 'number') {
    return ranked.slice(0, limit);
  }

  return ranked;
};

/** Symptoms logged on enough distinct days to feel familiar. */
export const getOftenWithYouSymptomIds = (
  logs: SymptomLogMap,
  excludeIds: readonly SymptomId[] = [],
): SymptomId[] => {
  const exclude = new Set(excludeIds);
  const counts = countSymptomDays(logs);
  const ranked = rankByDayCount(counts, OFTEN_WITH_YOU_MIN_DAYS, OFTEN_WITH_YOU_LIMIT).filter(
    (id) => !exclude.has(id),
  );

  if (ranked.length > 0) {
    return ranked;
  }

  return DEFAULT_OFTEN_WITH_YOU_IDS.filter((id) => !exclude.has(id));
};

/** Symptoms logged across many days (persistent complaints). */
export const getPersistentComplaintSymptomIds = (logs: SymptomLogMap): SymptomId[] => {
  const counts = countSymptomDays(logs);

  return rankByDayCount(counts, PERSISTENT_COMPLAINT_MIN_DAYS);
};

export const createDayEntry = (
  symptomId: SymptomId,
  intensity: SymptomIntensity,
  extras?: Record<string, string>,
): SymptomDayEntry => {
  const hasExtras = extras && Object.keys(extras).length > 0;

  return {
    symptomId,
    intensity,
    ...(hasExtras ? { extras } : {}),
  };
};
