import { fromDateKey } from '@/lib/date/dateKeys';

export const formatReportPeriodMonthYear = (
  dateKey: string,
  locale: string,
): string => {
  const date = fromDateKey(dateKey);

  return date.toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  });
};

export const formatReportPeriodRangeLabel = (
  fromDateKey: string,
  toDateKey: string,
): string => {
  const fromParts = fromDateKey.split('-');
  const toParts = toDateKey.split('-');

  if (fromParts.length !== 3 || toParts.length !== 3) {
    return `${fromDateKey} - ${toDateKey}`;
  }

  const fromLabel = `${fromParts[2]}.${fromParts[1]}.${fromParts[0]}`;
  const toLabel = `${toParts[2]}.${toParts[1]}.${toParts[0]}`;

  return `${fromLabel}-${toLabel}`;
};
