import type { MoodEntry, MoodId, MoodLogMap } from '@syna/shared-types';
import { MOOD_SCALE_MAX } from '@syna/shared-types';

export type { MoodEntry, MoodId, MoodLogMap };
export { MOOD_SCALE_MAX };

/** Mood chips shown on the symptoms entry Mood tab. */
export const SYMPTOM_ENTRY_MOOD_IDS = [
  'good',
  'balanced',
  'irritated',
  'depressed',
  'tense',
] as const satisfies readonly MoodId[];

export type SymptomEntryMoodId = (typeof SYMPTOM_ENTRY_MOOD_IDS)[number];

export const SYMPTOM_ENTRY_MOOD_LABEL_KEY: Record<SymptomEntryMoodId, string> = {
  good: 'symptom_entry_mood_good',
  balanced: 'symptom_entry_mood_balanced',
  irritated: 'symptom_entry_mood_irritated',
  depressed: 'symptom_entry_mood_depressed',
  tense: 'symptom_entry_mood_tense',
};

export const DEFAULT_MOOD_SCALE_VALUE = 3;

export const EMPTY_MOOD_ENTRY: MoodEntry = {
  primaryMood: null,
  feelings: [],
  energy: 0,
  stress: 0,
  medicationChange: null,
  note: '',
};

export const isMoodEntryEmpty = (entry: MoodEntry): boolean =>
  !entry.primaryMood &&
  entry.feelings.length === 0 &&
  entry.energy === 0 &&
  entry.stress === 0 &&
  entry.medicationChange === null &&
  entry.note.trim().length === 0;
