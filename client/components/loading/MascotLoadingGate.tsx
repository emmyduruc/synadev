import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { MascotLoadingOverlay } from '@/components/loading/MascotLoadingOverlay';
import { Box } from '@/components/ui/Box';
import {
  MASCOT_LOADING_FADE_MS,
  MASCOT_LOADING_MIN_MS,
  type LoadingVariant,
} from '@/lib/loading/loadingVariants';

type GatePhase = 'loading' | 'exiting' | 'done';

export type MascotLoadingGateProps = {
  children: ReactNode;
  variant: LoadingVariant;
  /** When true, the gate waits at least `minDurationMs` then fades the overlay out. */
  isReady: boolean;
  /** Set false to skip the overlay entirely (e.g. year calendar view). */
  enabled?: boolean;
  minDurationMs?: number;
  className?: string;
};

/**
 * Inline absolute mascot overlay on top of its children.
 * Children stay mounted underneath; the overlay blocks the view until ready + min duration.
 */
export const MascotLoadingGate = ({
  children,
  variant,
  isReady,
  enabled = true,
  minDurationMs = MASCOT_LOADING_MIN_MS,
  className,
}: MascotLoadingGateProps) => {
  const mountedAtRef = useRef(Date.now());
  const dismissTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasScheduledDismissRef = useRef(false);
  const [phase, setPhase] = useState<GatePhase>(enabled ? 'loading' : 'done');

  const clearTimers = () => {
    if (dismissTimeoutRef.current) {
      clearTimeout(dismissTimeoutRef.current);
      dismissTimeoutRef.current = null;
    }

    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    if (!enabled) {
      clearTimers();
      hasScheduledDismissRef.current = false;
      setPhase('done');
      return undefined;
    }

    clearTimers();
    hasScheduledDismissRef.current = false;
    mountedAtRef.current = Date.now();
    setPhase('loading');

    return undefined;
  }, [enabled, variant]);

  // Schedule dismiss once when ready. Do not depend on `phase` — that cleared the
  // exit timer on Android and left an invisible touch-blocking overlay forever.
  useEffect(() => {
    if (!enabled || !isReady || hasScheduledDismissRef.current) {
      return undefined;
    }

    hasScheduledDismissRef.current = true;
    const elapsed = Date.now() - mountedAtRef.current;
    const remaining = Math.max(0, minDurationMs - elapsed);

    dismissTimeoutRef.current = setTimeout(() => {
      setPhase('exiting');

      exitTimeoutRef.current = setTimeout(() => {
        setPhase('done');
      }, MASCOT_LOADING_FADE_MS);
    }, remaining);

    return undefined;
  }, [enabled, isReady, minDurationMs]);

  useEffect(
    () => () => {
      clearTimers();
    },
    [],
  );

  const showOverlay = enabled && phase !== 'done';

  return (
    <Box className={className ?? 'relative flex-1'}>
      {children}
      {showOverlay ? (
        <MascotLoadingOverlay variant={variant} isExiting={phase === 'exiting'} />
      ) : null}
    </Box>
  );
};
