import { z } from 'zod';

import { IsoDateSchema } from './iso-date.schema';

export const SYMPTOM_CATEGORY_IDS = [
  'vasomotor',
  'mood',
  'sleep_energy',
  'body_pain',
  'cycle',
  'urogenital',
  'digestion',
  'skin',
] as const;

export const SymptomCategoryIdSchema = z
  .enum(SYMPTOM_CATEGORY_IDS)
  .describe('Symptom parent category id');

export type SymptomCategoryId = z.infer<typeof SymptomCategoryIdSchema>;

export const SYMPTOM_IDS = [
  'hot_flashes',
  'night_sweats',
  'sweating',
  'calm',
  'irritable',
  'anxious',
  'low_mood',
  'mood_swings',
  'brain_fog',
  'insomnia',
  'fatigue',
  'sleepy',
  'headache',
  'joint_muscle_pain',
  'backache',
  'palpitations',
  'breast_tenderness',
  'flow_light',
  'flow_medium',
  'flow_heavy',
  'blood_clots',
  'spotting',
  'cramps',
  'vaginal_dryness',
  'vaginal_itching',
  'bladder_urgency',
  'low_libido',
  'unusual_discharge',
  'nausea',
  'bloating',
  'constipation',
  'diarrhea',
  'cravings',
  'acne',
  'dry_skin',
  'itchy_skin',
] as const;

export const SymptomIdSchema = z.enum(SYMPTOM_IDS).describe('Canonical symptom identifier');

export type SymptomId = z.infer<typeof SymptomIdSchema>;

export const isSymptomId = (value: string): value is SymptomId =>
  (SYMPTOM_IDS as readonly string[]).includes(value);

export const isSymptomCategoryId = (value: string): value is SymptomCategoryId =>
  (SYMPTOM_CATEGORY_IDS as readonly string[]).includes(value);

/** Catalog row returned by GET /symptoms/catalog */
export const SymptomCatalogOptionSchema = z.object({
  id: SymptomIdSchema.describe('Symptom id'),
  categoryId: SymptomCategoryIdSchema.describe('Parent category id'),
  sortOrder: z.number().int().describe('Display order within category'),
});

export type SymptomCatalogOption = z.infer<typeof SymptomCatalogOptionSchema>;

export const SymptomCatalogCategorySchema = z.object({
  id: SymptomCategoryIdSchema.describe('Category id'),
  sortOrder: z.number().int().describe('Display order among categories'),
  symptoms: z.array(SymptomCatalogOptionSchema).describe('Child symptoms'),
});

export type SymptomCatalogCategory = z.infer<typeof SymptomCatalogCategorySchema>;

export const SymptomCatalogSchema = z
  .object({
    categories: z.array(SymptomCatalogCategorySchema),
  })
  .describe('Seeded symptom taxonomy');

export type SymptomCatalog = z.infer<typeof SymptomCatalogSchema>;

export const SymptomLogMapSchema = z
  .record(IsoDateSchema, z.array(SymptomIdSchema))
  .describe('Map of YYYY-MM-DD → selected symptom ids');

export type SymptomLogMap = z.infer<typeof SymptomLogMapSchema>;

export const SymptomLogsSchema = z
  .object({
    logs: SymptomLogMapSchema,
  })
  .describe('All symptom logs for the authenticated user');

export type SymptomLogs = z.infer<typeof SymptomLogsSchema>;

export const ReplaceSymptomLogsSchema = SymptomLogsSchema;

export type ReplaceSymptomLogs = z.infer<typeof ReplaceSymptomLogsSchema>;
