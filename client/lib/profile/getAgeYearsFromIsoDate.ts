import { parseIsoDate } from '@/lib/profile/bioDataValidation';

/** Age in whole years from YYYY-MM-DD, or null if invalid. */
export const getAgeYearsFromIsoDate = (
  isoDate: string,
  asOf = new Date(),
): number | null => {
  const birthDate = parseIsoDate(isoDate);

  if (!birthDate) {
    return null;
  }

  let age = asOf.getFullYear() - birthDate.getFullYear();
  const monthDelta = asOf.getMonth() - birthDate.getMonth();
  const dayDelta = asOf.getDate() - birthDate.getDate();

  if (monthDelta < 0 || (monthDelta === 0 && dayDelta < 0)) {
    age -= 1;
  }

  return age >= 0 ? age : null;
};
