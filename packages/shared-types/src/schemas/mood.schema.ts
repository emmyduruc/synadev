import { z } from 'zod';

import { IsoDateSchema } from './iso-date.schema';

export const MOOD_IDS = [
  'happy',
  'calm',
  'content',
  'energetic',
  'confident',
  'loved',
  'neutral',
  'irritable',
  'anxious',
  'sad',
  'swings',
  'overwhelmed',
  'angry',
  'tearful',
  'unmotivated',
  'lonely',
] as const;

export const MoodIdSchema = z.enum(MOOD_IDS).describe('Canonical mood / feeling identifier');

export type MoodId = z.infer<typeof MoodIdSchema>;

export const isMoodId = (value: string): value is MoodId =>
  (MOOD_IDS as readonly string[]).includes(value);

export const MOOD_SCALE_MAX = 5;

export const MoodScaleSchema = z
  .number()
  .int()
  .min(0)
  .max(MOOD_SCALE_MAX)
  .describe('0 = unset; 1–5 intensity scale');

export const MoodEntrySchema = z
  .object({
    primaryMood: MoodIdSchema.nullable().describe('Single primary mood for the day'),
    feelings: z
      .array(MoodIdSchema)
      .describe('Secondary feelings (multi-select, excludes primary)'),
    energy: MoodScaleSchema.describe('Energy level 0–5'),
    stress: MoodScaleSchema.describe('Stress level 0–5'),
    note: z.string().max(2000).describe('Optional free-text note'),
  })
  .describe('Mood check-in for a single calendar day');

export type MoodEntry = z.infer<typeof MoodEntrySchema>;

export const MoodLogMapSchema = z
  .record(IsoDateSchema, MoodEntrySchema)
  .describe('Map of YYYY-MM-DD → mood entry');

export type MoodLogMap = z.infer<typeof MoodLogMapSchema>;

export const MoodLogsSchema = z
  .object({
    logs: MoodLogMapSchema,
  })
  .describe('All mood logs for the authenticated user');

export type MoodLogs = z.infer<typeof MoodLogsSchema>;

export const ReplaceMoodLogsSchema = MoodLogsSchema;

export type ReplaceMoodLogs = z.infer<typeof ReplaceMoodLogsSchema>;
