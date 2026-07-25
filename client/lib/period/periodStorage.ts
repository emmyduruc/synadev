export { toDateKey } from '@/lib/date/dateKeys';

export const toggleDateKey = (
  dateKeys: ReadonlySet<string>,
  dateKey: string,
): Set<string> => {
  const next = new Set(dateKeys);

  if (next.has(dateKey)) {
    next.delete(dateKey);
  } else {
    next.add(dateKey);
  }

  return next;
};
