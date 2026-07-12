export const MIN_BIO_AGE_YEARS = 18;

export const MAX_BIO_AGE_YEARS = 100;

export const parseIsoDate = (isoDate: string): Date | null => {
  if (!isoDate) {
    return null;
  }

  const parsed = new Date(`${isoDate}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
};

export const isAtLeastMinAge = (
  dateOfBirth: Date,
  minAgeYears = MIN_BIO_AGE_YEARS,
): boolean => {
  const today = new Date();
  const minimumBirthDate = new Date(
    today.getFullYear() - minAgeYears,
    today.getMonth(),
    today.getDate(),
  );

  return dateOfBirth <= minimumBirthDate;
};

export const toIsoDate = (year: number, monthIndex: number, day: number): string => {
  const month = String(monthIndex + 1).padStart(2, '0');
  const dayString = String(day).padStart(2, '0');

  return `${year}-${month}-${dayString}`;
};

export const getDaysInMonth = (year: number, monthIndex: number): number =>
  new Date(year, monthIndex + 1, 0).getDate();

export const getMaxBirthDateIso = (): string => {
  const today = new Date();

  return toIsoDate(
    today.getFullYear() - MIN_BIO_AGE_YEARS,
    today.getMonth(),
    today.getDate(),
  );
};

export const getMinBirthDateIso = (maxAgeYears = MAX_BIO_AGE_YEARS): string => {
  const today = new Date();

  return toIsoDate(
    today.getFullYear() - maxAgeYears,
    today.getMonth(),
    today.getDate(),
  );
};

export const clampIsoDate = (
  isoDate: string,
  minIsoDate: string,
  maxIsoDate: string,
): string => {
  if (isoDate < minIsoDate) {
    return minIsoDate;
  }

  if (isoDate > maxIsoDate) {
    return maxIsoDate;
  }

  return isoDate;
};

export const getDatePickerLocale = (language: string): string => {
  if (language.startsWith('de')) {
    return 'de-DE';
  }

  return 'en-US';
};
