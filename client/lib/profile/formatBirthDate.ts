import { getDatePickerLocale, parseIsoDate } from '@/lib/profile/bioDataValidation';

/** Full birth date for display, matching the wheel locale (e.g. "14. Oktober 1975"). */
export const formatBirthDate = (isoDate: string, language: string): string => {
  const parsed = parseIsoDate(isoDate);

  if (!parsed) {
    return '';
  }

  return parsed.toLocaleDateString(getDatePickerLocale(language), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};
