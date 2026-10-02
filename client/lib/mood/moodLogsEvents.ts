type MoodLogsListener = () => void;

const listeners = new Set<MoodLogsListener>();

/** Subscribe to mood-log saves from any screen (symptoms Mood tab, mood screen, …). */
export const subscribeMoodLogsChanged = (
  listener: MoodLogsListener,
): (() => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const emitMoodLogsChanged = (): void => {
  listeners.forEach((listener) => {
    listener();
  });
};
