export const LANGUAGE = {
  en: 'en',
  de: 'de',
} as const;

export type Language = (typeof LANGUAGE)[keyof typeof LANGUAGE];

export const DEFAULT_LANGUAGE: Language = LANGUAGE.en;
