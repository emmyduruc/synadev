import { z } from 'zod';

import { IsoDateSchema } from './iso-date.schema';
import { AppLocaleSchema } from './locale.schema';

export const CYCLE_PHASE = {
  period: 'period',
  follicular: 'follicular',
  ovulation: 'ovulation',
  luteal: 'luteal',
} as const;

export const CYCLE_PHASES = [
  CYCLE_PHASE.period,
  CYCLE_PHASE.follicular,
  CYCLE_PHASE.ovulation,
  CYCLE_PHASE.luteal,
] as const;

export const CyclePhaseSchema = z
  .enum(CYCLE_PHASES)
  .describe('Estimated menstrual cycle phase');

export type CyclePhaseId = z.infer<typeof CyclePhaseSchema>;

export const CyclePhaseSnapshotSchema = z
  .object({
    phase: CyclePhaseSchema.nullable().describe(
      'Current phase, or null when no period data / cannot estimate',
    ),
    cycleDay: z
      .number()
      .int()
      .positive()
      .nullable()
      .describe('1-based day within the current cycle'),
    cycleLengthDays: z
      .number()
      .int()
      .describe('Estimated cycle length used for this snapshot'),
    periodLengthDays: z
      .number()
      .int()
      .describe('Estimated bleed length for the active period'),
    ovulationDay: z
      .number()
      .int()
      .nullable()
      .describe('1-based cycle day of estimated ovulation'),
    periodStartDateKey: IsoDateSchema.nullable().describe(
      'First day of the active period cluster',
    ),
    nextPeriodDateKey: IsoDateSchema.nullable().describe(
      'Predicted first day of the next period',
    ),
    hasPeriodData: z.boolean().describe('True when at least one period day is logged'),
    asOfDateKey: IsoDateSchema.describe('Calendar day this snapshot was computed for'),
  })
  .describe('Estimated cycle phase snapshot for the authenticated user');

export type CyclePhaseSnapshotDto = z.infer<typeof CyclePhaseSnapshotSchema>;

export const RegisterPushTokenSchema = z
  .object({
    token: z
      .string()
      .min(1)
      .max(512)
      .describe('Expo push token (ExponentPushToken[…])'),
    platform: z
      .enum(['ios', 'android', 'web'])
      .describe('Device platform that owns the token'),
    locale: AppLocaleSchema.optional().describe(
      'Device / app locale used for push + email copy (defaults to de on the server)',
    ),
  })
  .describe('Register or refresh an Expo push token for the current user');

export type RegisterPushToken = z.infer<typeof RegisterPushTokenSchema>;

export const RegisterPushTokenResponseSchema = z.object({
  ok: z.literal(true).describe('Token stored successfully'),
});

export type RegisterPushTokenResponse = z.infer<typeof RegisterPushTokenResponseSchema>;
