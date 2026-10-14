import { z } from 'zod';

import { IsoDateSchema } from './iso-date.schema';

export const PERIOD_BLEEDING_TYPE = {
  period: 'period',
  spotting: 'spotting',
  breakthrough: 'breakthrough',
} as const;

export const PERIOD_BLEEDING_TYPES = [
  PERIOD_BLEEDING_TYPE.period,
  PERIOD_BLEEDING_TYPE.spotting,
  PERIOD_BLEEDING_TYPE.breakthrough,
] as const;

export type PeriodBleedingType = (typeof PERIOD_BLEEDING_TYPES)[number];

export const PERIOD_STRENGTH = {
  light: 'light',
  medium: 'medium',
  strong: 'strong',
} as const;

export const PERIOD_STRENGTHS = [
  PERIOD_STRENGTH.light,
  PERIOD_STRENGTH.medium,
  PERIOD_STRENGTH.strong,
] as const;

export type PeriodStrength = (typeof PERIOD_STRENGTHS)[number];

export const PERIOD_OBSERVATION = {
  lumps_or_tissue: 'lumps_or_tissue',
  unusually_long: 'unusually_long',
  more_severe_pain: 'more_severe_pain',
  restricted_daily_life: 'restricted_daily_life',
  none: 'none',
} as const;

export const PERIOD_OBSERVATIONS = [
  PERIOD_OBSERVATION.lumps_or_tissue,
  PERIOD_OBSERVATION.unusually_long,
  PERIOD_OBSERVATION.more_severe_pain,
  PERIOD_OBSERVATION.restricted_daily_life,
  PERIOD_OBSERVATION.none,
] as const;

export type PeriodObservation = (typeof PERIOD_OBSERVATIONS)[number];

export const PeriodBleedingTypeSchema = z
  .enum(PERIOD_BLEEDING_TYPES)
  .describe('Type of bleeding logged for the day');

export const PeriodStrengthSchema = z
  .enum(PERIOD_STRENGTHS)
  .describe('Perceived bleeding strength');

export const PeriodObservationSchema = z
  .enum(PERIOD_OBSERVATIONS)
  .describe('Optional bleeding observation chip');

/** One logged bleeding day with optional clinical detail fields. */
export const PeriodDaySchema = z
  .object({
    dateKey: IsoDateSchema.describe('YYYY-MM-DD bleeding day'),
    isFirstDay: z
      .boolean()
      .nullable()
      .describe('True when this day is the first day of the period'),
    bleedingType: PeriodBleedingTypeSchema.nullable().describe(
      'Bleeding type for this day',
    ),
    strength: PeriodStrengthSchema.nullable().describe(
      'Bleeding strength for this day',
    ),
    observations: z
      .array(PeriodObservationSchema)
      .describe('Optional observation chips for this day'),
    notes: z
      .string()
      .max(2000)
      .nullable()
      .describe('Optional free-text note about bleeding'),
  })
  .describe('A single period/bleeding day with details');

export type PeriodDay = z.infer<typeof PeriodDaySchema>;

/** All logged period (bleeding) days for the current user. */
export const PeriodDaysSchema = z
  .object({
    dateKeys: z
      .array(IsoDateSchema)
      .describe('Sorted unique YYYY-MM-DD period days'),
    days: z
      .array(PeriodDaySchema)
      .describe('Period days with bleeding details'),
  })
  .describe('Period days snapshot for the authenticated user');

export type PeriodDays = z.infer<typeof PeriodDaysSchema>;

/**
 * Replace the full set of period days.
 * Prefer `days` when details are known. `dateKeys`-only keeps existing details
 * for dates that remain and creates bare rows for new dates.
 * At least one of `days` or `dateKeys` must be provided (enforced in the service).
 */
export const ReplacePeriodDaysSchema = z
  .object({
    days: z
      .array(PeriodDaySchema)
      .optional()
      .describe('Full period day rows including bleeding details'),
    dateKeys: z
      .array(IsoDateSchema)
      .optional()
      .describe(
        'Sorted unique YYYY-MM-DD period days (date-only replace; keeps details)',
      ),
  })
  .describe('Replace period days payload');

export type ReplacePeriodDays = z.infer<typeof ReplacePeriodDaysSchema>;

export const createEmptyPeriodDay = (dateKey: string): PeriodDay => ({
  dateKey,
  isFirstDay: null,
  bleedingType: null,
  strength: null,
  observations: [],
  notes: null,
});
