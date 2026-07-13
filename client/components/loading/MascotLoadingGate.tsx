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
  const [phase, setPhase] = useState<GatePhase>(enabled ? 'loading' : 'done');

  useEffect(() => {
    if (!enabled) {
      setPhase('done');
      return undefined;
    }

    mountedAtRef.current = Date.now();
    setPhase('loading');

    return undefined;
  }, [enabled, variant]);

  useEffect(() => {
    if (!enabled || !isReady || phase !== 'loading') {
      return undefined;
    }

    const elapsed = Date.now() - mountedAtRef.current;
    const remaining = Math.max(0, minDurationMs - elapsed);

    dismissTimeoutRef.current = setTimeout(() => {
      setPhase('exiting');

      exitTimeoutRef.current = setTimeout(() => {
        setPhase('done');
      }, MASCOT_LOADING_FADE_MS);
    }, remaining);

    return () => {
      if (dismissTimeoutRef.current) {
        clearTimeout(dismissTimeoutRef.current);
        dismissTimeoutRef.current = null;
      }

      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }
    };
  }, [enabled, isReady, minDurationMs, phase]);

  useEffect(
    () => () => {
      if (dismissTimeoutRef.current) {
        clearTimeout(dismissTimeoutRef.current);
      }

      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }
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
