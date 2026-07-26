import { z } from 'zod';

/** Supported app / notification locales. German is the product default. */
export const APP_LOCALE = {
  de: 'de',
  en: 'en',
} as const;

export const APP_LOCALES = [APP_LOCALE.de, APP_LOCALE.en] as const;

export const DEFAULT_APP_LOCALE = APP_LOCALE.de;

export const AppLocaleSchema = z
  .enum(APP_LOCALES)
  .describe('Preferred UI / notification locale (de | en)');

export type AppLocale = z.infer<typeof AppLocaleSchema>;

export const isAppLocale = (value: string): value is AppLocale =>
  (APP_LOCALES as readonly string[]).includes(value);

export const resolveAppLocale = (value: string | null | undefined): AppLocale => {
  if (!value) {
    return DEFAULT_APP_LOCALE;
  }

  const normalized = value.trim().toLowerCase().slice(0, 2);

  return isAppLocale(normalized) ? normalized : DEFAULT_APP_LOCALE;
};

export const UpdateUserLocaleSchema = z
  .object({
    locale: AppLocaleSchema.describe('Preferred locale from the device / app'),
  })
  .describe('Update the authenticated user’s preferred locale');

export type UpdateUserLocale = z.infer<typeof UpdateUserLocaleSchema>;
