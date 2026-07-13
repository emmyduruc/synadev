import * as SecureStore from 'expo-secure-store';

import { isDateKey } from '@/lib/date/dateKeys';

export const SYMPTOM_LOGS_STORAGE_KEY = 'symptom_logs_by_date';

export type SymptomLogMap = Record<string, string[]>;

const sanitize = (parsed: unknown): SymptomLogMap => {
  if (typeof parsed !== 'object' || parsed === null) {
    return {};
  }

  const result: SymptomLogMap = {};

  for (const [dateKey, value] of Object.entries(parsed)) {
    if (!isDateKey(dateKey) || !Array.isArray(value)) {
      continue;
    }

    const ids = value.filter((entry): entry is string => typeof entry === 'string');

    if (ids.length > 0) {
      result[dateKey] = [...new Set(ids)];
    }
  }

  return result;
};

export const loadSymptomLogs = async (): Promise<SymptomLogMap> => {
  const raw = await SecureStore.getItemAsync(SYMPTOM_LOGS_STORAGE_KEY);

  if (!raw) {
    return {};
  }

  try {
    return sanitize(JSON.parse(raw));
  } catch {
    return {};
  }
};

export const saveSymptomLogs = async (logs: SymptomLogMap): Promise<void> => {
  const cleaned: SymptomLogMap = {};

  for (const [dateKey, ids] of Object.entries(logs)) {
    if (isDateKey(dateKey) && ids.length > 0) {
      cleaned[dateKey] = [...new Set(ids)];
    }
  }

  await SecureStore.setItemAsync(SYMPTOM_LOGS_STORAGE_KEY, JSON.stringify(cleaned));
};
