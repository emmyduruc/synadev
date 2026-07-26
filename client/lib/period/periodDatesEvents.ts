type PeriodDatesListener = () => void;

const listeners = new Set<PeriodDatesListener>();

/** Subscribe to period-day saves from any screen (calendar, record-period, …). */
export const subscribePeriodDatesChanged = (
  listener: PeriodDatesListener,
): (() => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const emitPeriodDatesChanged = (): void => {
  listeners.forEach((listener) => {
    listener();
  });
};
