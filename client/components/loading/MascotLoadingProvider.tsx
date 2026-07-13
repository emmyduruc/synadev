import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { MascotLoadingOverlay } from '@/components/loading/MascotLoadingOverlay';
import {
  LOADING_VARIANT,
  MASCOT_LOADING_FADE_MS,
  MASCOT_LOADING_MIN_MS,
  type LoadingVariant,
} from '@/lib/loading/loadingVariants';

type MascotLoadingState = {
  variant: LoadingVariant;
  isExiting: boolean;
};

type MascotLoadingContextValue = {
  showLoading: (variant?: LoadingVariant) => void;
  hideLoading: (onComplete?: () => void) => void;
  isLoadingVisible: boolean;
};

const MascotLoadingContext = createContext<MascotLoadingContextValue | null>(null);

export type MascotLoadingProviderProps = {
  children: ReactNode;
};

export const MascotLoadingProvider = ({ children }: MascotLoadingProviderProps) => {
  const [state, setState] = useState<MascotLoadingState | null>(null);
  const stateRef = useRef<MascotLoadingState | null>(null);
  const shownAtRef = useRef(0);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  stateRef.current = state;

  const clearTimers = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const showLoading = useCallback(
    (variant: LoadingVariant = LOADING_VARIANT.generic) => {
      clearTimers();
      shownAtRef.current = Date.now();
      setState({ variant, isExiting: false });
    },
    [clearTimers],
  );

  const hideLoading = useCallback(
    (onComplete?: () => void) => {
      if (!stateRef.current) {
        onComplete?.();
        return;
      }

      clearTimers();

      const elapsed = Date.now() - shownAtRef.current;
      const remaining = Math.max(0, MASCOT_LOADING_MIN_MS - elapsed);

      hideTimeoutRef.current = setTimeout(() => {
        setState((previous) => (previous ? { ...previous, isExiting: true } : null));

        exitTimeoutRef.current = setTimeout(() => {
          setState(null);
          onComplete?.();
        }, MASCOT_LOADING_FADE_MS);
      }, remaining);
    },
    [clearTimers],
  );

  const value = useMemo(
    () => ({
      showLoading,
      hideLoading,
      isLoadingVisible: state !== null && !state.isExiting,
    }),
    [hideLoading, showLoading, state],
  );

  return (
    <MascotLoadingContext.Provider value={value}>
      {children}
      {state ? (
        <MascotLoadingOverlay variant={state.variant} isExiting={state.isExiting} useModal />
      ) : null}
    </MascotLoadingContext.Provider>
  );
};

export const useMascotLoading = (): MascotLoadingContextValue => {
  const context = useContext(MascotLoadingContext);

  if (!context) {
    throw new Error('useMascotLoading must be used within MascotLoadingProvider');
  }

  return context;
};
