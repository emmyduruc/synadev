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
  'cognition',
  'miscellaneous',
] as const;

export const SymptomCategoryIdSchema = z
  .enum(SYMPTOM_CATEGORY_IDS)
  .describe('Symptom parent category id');

export type SymptomCategoryId = z.infer<typeof SymptomCategoryIdSchema>;

export const SYMPTOM_IDS = [
  'hot_flashes',
  'night_sweats',
  'sweating',
  'chills',
  'calm',
  'irritable',
  'anxious',
  'low_mood',
  'mood_swings',
  'inner_restlessness',
  'brain_fog',
  'insomnia',
  'sleep_maintenance',
  'fatigue',
  'sleepy',
  'headache',
  'joint_muscle_pain',
  'muscle_pain',
  'joint_stiffness',
  'backache',
  'palpitations',
  'breast_tenderness',
  'dizziness',
  'tingling',
  'flow_light',
  'flow_medium',
  'flow_heavy',
  'blood_clots',
  'bleeding',
  'spotting',
  'cramps',
  'vaginal_dryness',
  'vaginal_itching',
  'bladder_urgency',
  'nocturia',
  'low_libido',
  'unusual_discharge',
  'pain_on_urination',
  'nausea',
  'bloating',
  'constipation',
  'diarrhea',
  'cravings',
  'digestive_patterns',
  'acne',
  'dry_skin',
  'itchy_skin',
  'dryness',
  'skin_and_hair',
  'forgetfulness',
  'concentration_problems',
  'word_finding',
] as const;

export const CatalogSymptomIdSchema = z
  .enum(SYMPTOM_IDS)
  .describe('Seeded catalog symptom identifier');

export type CatalogSymptomId = z.infer<typeof CatalogSymptomIdSchema>;

/** User-created symptom ids are stored as custom_<token>. */
export const CUSTOM_SYMPTOM_ID_PREFIX = 'custom_' as const;

export const CUSTOM_SYMPTOM_ID_PATTERN = /^custom_[a-z0-9_-]{6,48}$/i;

export const isCatalogSymptomId = (value: string): value is CatalogSymptomId =>
  (SYMPTOM_IDS as readonly string[]).includes(value);

export const isCustomSymptomId = (value: string): boolean =>
  CUSTOM_SYMPTOM_ID_PATTERN.test(value);

export const SymptomIdSchema = z
  .string()
  .min(1)
  .max(64)
  .refine((value) => isCatalogSymptomId(value) || isCustomSymptomId(value), {
    message: 'Invalid symptom id',
  })
  .describe('Catalog symptom id or custom_<token>');

export type SymptomId = z.infer<typeof SymptomIdSchema>;

export const isSymptomId = (value: string): value is SymptomId =>
  isCatalogSymptomId(value) || isCustomSymptomId(value);

export const isSymptomCategoryId = (value: string): value is SymptomCategoryId =>
  (SYMPTOM_CATEGORY_IDS as readonly string[]).includes(value);

/** Intensity scale used in symptom detail sheets (0 none … 4 very strong). */
export const SYMPTOM_INTENSITY_VALUES = [0, 1, 2, 3, 4] as const;

export const SymptomIntensitySchema = z
  .number()
  .int()
  .min(0)
  .max(4)
  .describe('Symptom intensity 0 (none) to 4 (very strong)');

export type SymptomIntensity = z.infer<typeof SymptomIntensitySchema>;

export const SymptomDayEntrySchema = z
  .object({
    symptomId: SymptomIdSchema.describe('Selected symptom id'),
    intensity: SymptomIntensitySchema,
    extras: z
      .record(z.string(), z.string())
      .optional()
      .describe('Optional symptom-specific answers (sheet questions)'),
  })
  .describe('One selected symptom for a calendar day');

export type SymptomDayEntry = z.infer<typeof SymptomDayEntrySchema>;

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

/**
 * Day-entry list schema. Legacy string ids are accepted and normalized to
 * `{ symptomId, intensity: 2 }` before validation completes.
 */
const normalizeDayEntries = (value: unknown): SymptomDayEntry[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const entries: SymptomDayEntry[] = [];

  for (const item of value) {
    if (typeof item === 'string') {
      if (!isSymptomId(item)) {
        continue;
      }

      entries.push({ symptomId: item, intensity: 2 });
      continue;
    }

    const parsed = SymptomDayEntrySchema.safeParse(item);

    if (parsed.success) {
      entries.push(parsed.data);
    }
  }

  return entries;
};

export const SymptomDayEntriesSchema: z.ZodType<SymptomDayEntry[]> = z
  .any()
  .transform(normalizeDayEntries)
  .pipe(z.array(SymptomDayEntrySchema));

export type SymptomDayEntries = SymptomDayEntry[];

export const SymptomLogMapSchema: z.ZodType<Record<string, SymptomDayEntry[]>> = z
  .record(IsoDateSchema, z.any())
  .transform((logs) => {
    const next: Record<string, SymptomDayEntry[]> = {};

    for (const [dateKey, value] of Object.entries(logs)) {
      next[dateKey] = normalizeDayEntries(value);
    }

    return next;
  });

export type SymptomLogMap = Record<string, SymptomDayEntry[]>;

export const SymptomLogsSchema: z.ZodType<{ logs: SymptomLogMap }> = z.object({
  logs: SymptomLogMapSchema,
});

export type SymptomLogs = { logs: SymptomLogMap };

export const ReplaceSymptomLogsSchema = SymptomLogsSchema;

export type ReplaceSymptomLogs = SymptomLogs;

export const SymptomFavoritesSchema = z
  .object({
    symptomIds: z
      .array(SymptomIdSchema)
      .max(50)
      .describe('User favorite symptom ids for quick access'),
  })
  .describe('Favorite symptoms for the authenticated user');

export type SymptomFavorites = z.infer<typeof SymptomFavoritesSchema>;

export const ReplaceSymptomFavoritesSchema = SymptomFavoritesSchema;

export type ReplaceSymptomFavorites = z.infer<typeof ReplaceSymptomFavoritesSchema>;

export const CustomSymptomSchema = z
  .object({
    id: SymptomIdSchema.describe('Custom symptom id (custom_…)'),
    label: z.string().trim().min(1).max(80).describe('User-facing designation'),
    categoryId: SymptomCategoryIdSchema.describe('Optional grouping category'),
  })
  .describe('User-defined symptom');

export type CustomSymptom = z.infer<typeof CustomSymptomSchema>;

export const CustomSymptomsSchema = z
  .object({
    symptoms: z.array(CustomSymptomSchema).describe('Custom symptoms for the user'),
  })
  .describe('List of user-defined symptoms');

export type CustomSymptoms = z.infer<typeof CustomSymptomsSchema>;

export const CreateCustomSymptomSchema = z
  .object({
    label: z.string().trim().min(1).max(80).describe('Designation for the custom symptom'),
    categoryId: SymptomCategoryIdSchema.describe(
      'Category to file the custom symptom under',
    ),
  })
  .describe('Create a user-defined symptom');

export type CreateCustomSymptom = z.infer<typeof CreateCustomSymptomSchema>;
