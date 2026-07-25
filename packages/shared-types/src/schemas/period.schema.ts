import { z } from 'zod';

import { IsoDateSchema } from './iso-date.schema';

/** All logged period (bleeding) days for the current user. */
export const PeriodDaysSchema = z
  .object({
    dateKeys: z
      .array(IsoDateSchema)
      .describe('Sorted unique YYYY-MM-DD period days'),
  })
  .describe('Period days snapshot for the authenticated user');

export type PeriodDays = z.infer<typeof PeriodDaysSchema>;

/** Replace the full set of period days (calendar / record-period persist). */
export const ReplacePeriodDaysSchema = PeriodDaysSchema;

export type ReplacePeriodDays = z.infer<typeof ReplacePeriodDaysSchema>;
