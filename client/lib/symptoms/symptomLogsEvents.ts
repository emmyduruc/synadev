type SymptomLogsListener = () => void;

const listeners = new Set<SymptomLogsListener>();

/** Subscribe to symptom-log saves from any screen (symptoms entry, record-period, …). */
export const subscribeSymptomLogsChanged = (
  listener: SymptomLogsListener,
): (() => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const emitSymptomLogsChanged = (): void => {
  listeners.forEach((listener) => {
    listener();
  });
};
