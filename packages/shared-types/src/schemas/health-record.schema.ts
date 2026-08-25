import { z } from 'zod';

import { IsoDateSchema } from './iso-date.schema';

/**
 * Clinical health-record document stored on `users.health_record` JSONB.
 * Labs, medications, and patient concerns for the doctor report.
 * PHQ-2 lives in assessment_submissions (instrument `phq2`), not here.
 */

export const HealthRecordLabsSchema = z
  .object({
    fsh: z
      .number()
      .finite()
      .nullable()
      .describe('FSH lab value; null if not recorded'),
    estradiol: z
      .number()
      .finite()
      .nullable()
      .describe('Estradiol (E2) lab value; null if not recorded'),
    drawnAt: IsoDateSchema.nullable().describe(
      'Blood-draw date (YYYY-MM-DD); null if unknown',
    ),
    notes: z
      .string()
      .trim()
      .max(500)
      .nullable()
      .describe('Optional lab notes'),
  })
  .describe('Hormone lab results for the health record');

export type HealthRecordLabs = z.infer<typeof HealthRecordLabsSchema>;

export const HealthRecordMedicationSchema = z
  .object({
    id: z.string().uuid().describe('Client-generated medication row id'),
    name: z
      .string()
      .trim()
      .min(1)
      .max(200)
      .describe('Medication or HRT product name'),
    dose: z
      .string()
      .trim()
      .max(100)
      .nullable()
      .describe('Dose text (e.g. 1 mg daily); null if unset'),
    startedAt: IsoDateSchema.nullable().describe(
      'Optional start date (YYYY-MM-DD)',
    ),
    notes: z
      .string()
      .trim()
      .max(500)
      .nullable()
      .describe('Optional medication notes'),
  })
  .describe('One medication entry in the health record');

export type HealthRecordMedication = z.infer<typeof HealthRecordMedicationSchema>;

export const UserHealthRecordSchema = z
  .object({
    labs: HealthRecordLabsSchema.nullable().describe(
      'Latest lab snapshot; null when never entered',
    ),
    medications: z
      .array(HealthRecordMedicationSchema)
      .max(50)
      .describe('Current medication list'),
    concerns: z
      .string()
      .trim()
      .max(2000)
      .nullable()
      .describe('Free-text concerns for the doctor visit'),
    syncedAt: z
      .string()
      .datetime()
      .describe('ISO 8601 timestamp when this document was last saved'),
  })
  .describe('Persisted health-record document for a user');

export type UserHealthRecord = z.infer<typeof UserHealthRecordSchema>;

/** Request body for PATCH /users/me/health-record (full replace). */
export const UpdateUserHealthRecordSchema = UserHealthRecordSchema;

export type UpdateUserHealthRecord = z.infer<typeof UpdateUserHealthRecordSchema>;

export const createEmptyUserHealthRecord = (
  syncedAt = new Date().toISOString(),
): UserHealthRecord => ({
  labs: null,
  medications: [],
  concerns: null,
  syncedAt,
});
