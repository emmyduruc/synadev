import type { MoodEntry, MoodLogMap } from '@syna/shared-types';
import { MOOD_SCALE_MAX } from '@syna/shared-types';

export type { MoodEntry, MoodLogMap };
export { MOOD_SCALE_MAX };

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
