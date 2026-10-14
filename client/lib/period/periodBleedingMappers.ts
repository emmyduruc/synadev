import type { PeriodDay } from '@syna/shared-types';

import {
  EMPTY_PERIOD_BLEEDING_DETAILS,
  type PeriodBleedingDetails,
} from '@/lib/period/periodBleedingConstants';

export const periodDayToDetails = (
  day?: PeriodDay | null,
): PeriodBleedingDetails => {
  if (!day) {
    return EMPTY_PERIOD_BLEEDING_DETAILS;
  }

  return {
    isFirstDay: day.isFirstDay,
    bleedingType: day.bleedingType,
    strength: day.strength,
    observations: [...day.observations],
    notes: day.notes ?? '',
  };
};

export const detailsToPeriodDay = (
  dateKey: string,
  details: PeriodBleedingDetails,
): PeriodDay => ({
  dateKey,
  isFirstDay: details.isFirstDay,
  bleedingType: details.bleedingType,
  strength: details.strength,
  observations: [...details.observations],
  notes: details.notes.trim() ? details.notes.trim() : null,
});
