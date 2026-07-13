import * as SecureStore from 'expo-secure-store';

import { isDateKey } from '@/lib/date/dateKeys';
import { MOOD_SCALE_MAX } from '@/lib/mood/moodCatalog';

export const MOOD_LOGS_STORAGE_KEY = 'mood_logs_by_date';

export type MoodEntry = {
  primaryMood: string | null;
  feelings: string[];
  energy: number;
  stress: number;
  note: string;
};

export type MoodLogMap = Record<string, MoodEntry>;

export const EMPTY_MOOD_ENTRY: MoodEntry = {
  primaryMood: null,
  feelings: [],
  energy: 0,
  stress: 0,
  note: '',
};

export const isMoodEntryEmpty = (entry: MoodEntry): boolean =>
  !entry.primaryMood &&
  entry.feelings.length === 0 &&
  entry.energy === 0 &&
  entry.stress === 0 &&
  entry.note.trim().length === 0;

const clampScale = (value: unknown): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0;
  }

  if (value < 0) {
    return 0;
  }

  return value > MOOD_SCALE_MAX ? MOOD_SCALE_MAX : Math.round(value);
};

const sanitizeEntry = (value: unknown): MoodEntry | null => {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const primaryMood = typeof record.primaryMood === 'string' ? record.primaryMood : null;
  const feelings = Array.isArray(record.feelings)
    ? record.feelings.filter((entry): entry is string => typeof entry === 'string')
    : [];
  const note = typeof record.note === 'string' ? record.note : '';

  const entry: MoodEntry = {
    primaryMood,
    feelings: [...new Set(feelings)],
    energy: clampScale(record.energy),
    stress: clampScale(record.stress),
    note,
  };

  return isMoodEntryEmpty(entry) ? null : entry;
};

export const loadMoodLogs = async (): Promise<MoodLogMap> => {
  const raw = await SecureStore.getItemAsync(MOOD_LOGS_STORAGE_KEY);

  if (!raw) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (typeof parsed !== 'object' || parsed === null) {
      return {};
    }

    const result: MoodLogMap = {};

    for (const [dateKey, value] of Object.entries(parsed)) {
      const entry = isDateKey(dateKey) ? sanitizeEntry(value) : null;

      if (entry) {
        result[dateKey] = entry;
      }
    }

    return result;
  } catch {
    return {};
  }
};

export const saveMoodLogs = async (logs: MoodLogMap): Promise<void> => {
  const cleaned: MoodLogMap = {};

  for (const [dateKey, entry] of Object.entries(logs)) {
    if (isDateKey(dateKey) && !isMoodEntryEmpty(entry)) {
      cleaned[dateKey] = entry;
    }
  }

  await SecureStore.setItemAsync(MOOD_LOGS_STORAGE_KEY, JSON.stringify(cleaned));
};
