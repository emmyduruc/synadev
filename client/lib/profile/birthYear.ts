import {
  MAX_BIO_AGE_YEARS,
  MIN_BIO_AGE_YEARS,
  parseIsoDate,
} from '@/lib/profile/bioDataValidation';

/** Store year-only birth as ISO date (Jan 1) for the existing `dateOfBirth` column. */
export const isoDateFromBirthYear = (year: number): string => `${year}-01-01`;

export const birthYearFromIsoDate = (isoDate: string): string => {
  const parsed = parseIsoDate(isoDate);

  if (!parsed) {
    return '';
  }

  return String(parsed.getFullYear());
};

export const getBirthYearBounds = (
  now = new Date(),
): { minYear: number; maxYear: number } => {
  const currentYear = now.getFullYear();

  return {
    minYear: currentYear - MAX_BIO_AGE_YEARS,
    maxYear: currentYear - MIN_BIO_AGE_YEARS,
  };
};

export const parseBirthYearInput = (raw: string): number | null => {
  const trimmed = raw.trim();

  if (!/^\d{4}$/.test(trimmed)) {
    return null;
  }

  return Number(trimmed);
};

export const isValidBirthYear = (year: number, now = new Date()): boolean => {
  const { minYear, maxYear } = getBirthYearBounds(now);

  return year >= minYear && year <= maxYear;
};
