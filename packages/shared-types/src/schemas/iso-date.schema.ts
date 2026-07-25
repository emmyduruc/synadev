import { z } from 'zod';

/** ISO calendar date (YYYY-MM-DD). */
export const IsoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
  .describe('ISO calendar date in YYYY-MM-DD format');
