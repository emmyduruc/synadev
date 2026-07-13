import * as SecureStore from 'expo-secure-store';

import { isDateKey } from '@/lib/date/dateKeys';
import { PERIOD_DATES_STORAGE_KEY } from '@/lib/period/constants';

export { toDateKey } from '@/lib/date/dateKeys';

export const loadPeriodDateKeys = async (): Promise<string[]> => {
  const raw = await SecureStore.getItemAsync(PERIOD_DATES_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((entry): entry is string => typeof entry === 'string' && isDateKey(entry));
  } catch {
    return [];
  }
};

export const savePeriodDateKeys = async (dateKeys: readonly string[]): Promise<void> => {
  const uniqueSorted = [...new Set(dateKeys.filter(isDateKey))].sort();
  await SecureStore.setItemAsync(PERIOD_DATES_STORAGE_KEY, JSON.stringify(uniqueSorted));
};

export const toggleDateKey = (
  dateKeys: ReadonlySet<string>,
  dateKey: string,
): Set<string> => {
  const next = new Set(dateKeys);

  if (next.has(dateKey)) {
    next.delete(dateKey);
  } else {
    next.add(dateKey);
  }

  return next;
};
