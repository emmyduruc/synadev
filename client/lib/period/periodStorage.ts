import * as SecureStore from 'expo-secure-store';

import { PERIOD_DATES_STORAGE_KEY } from '@/lib/period/constants';

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const isDateKey = (value: string): boolean => DATE_KEY_PATTERN.test(value);

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
