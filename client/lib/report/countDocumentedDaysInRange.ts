import type { SymptomLogMap } from '@syna/shared-types';

import { buildDateKeysInclusive } from '@/lib/report/reportDateRange';

export const countDocumentedDaysInRange = (
  logs: SymptomLogMap,
  fromDateKey: string,
  toDateKey: string,
): number => {
  const keys = buildDateKeysInclusive(fromDateKey, toDateKey);
  let documentedDays = 0;

  for (const dateKey of keys) {
    const entries = logs[dateKey];

    if (entries && entries.length > 0) {
      documentedDays += 1;
    }
  }

  return documentedDays;
};
