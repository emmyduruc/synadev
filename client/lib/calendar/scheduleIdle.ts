/**
 * Schedule non-urgent work after the current frame.
 * Prefer requestIdleCallback when available (RN deprecates InteractionManager).
 */
export const scheduleIdle = (callback: () => void): (() => void) => {
  if (typeof requestIdleCallback === 'function') {
    const idleId = requestIdleCallback(() => {
      callback();
    });

    return () => {
      cancelIdleCallback(idleId);
    };
  }

  const timeoutId = setTimeout(callback, 1);

  return () => {
    clearTimeout(timeoutId);
  };
};
