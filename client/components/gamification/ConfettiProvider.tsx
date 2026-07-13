import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { ConfettiCelebration } from '@/components/gamification/ConfettiCelebration';
import {
  getConfettiPaletteForAction,
  isConfettiWorthyAction,
  type ConfettiAction,
} from '@/lib/gamification/confettiActions';

type ConfettiBurst = {
  id: number;
  action: ConfettiAction;
  palette: readonly string[];
};

type ConfettiContextValue = {
  celebrate: (action: ConfettiAction) => void;
};

const ConfettiContext = createContext<ConfettiContextValue | null>(null);

export type ConfettiProviderProps = {
  children: ReactNode;
};

export const ConfettiProvider = ({ children }: ConfettiProviderProps) => {
  const [bursts, setBursts] = useState<ConfettiBurst[]>([]);

  const celebrate = useCallback((action: ConfettiAction) => {
    if (!isConfettiWorthyAction(action)) {
      return;
    }

    setBursts((previous) => [
      ...previous,
      {
        id: Date.now() + previous.length,
        action,
        palette: getConfettiPaletteForAction(action),
      },
    ]);
  }, []);

  const handleBurstComplete = useCallback((burstId: number) => {
    setBursts((previous) => previous.filter((burst) => burst.id !== burstId));
  }, []);

  const value = useMemo(() => ({ celebrate }), [celebrate]);

  return (
    <ConfettiContext.Provider value={value}>
      {children}
      {bursts.map((burst) => (
        <ConfettiCelebration
          key={burst.id}
          palette={burst.palette}
          onComplete={() => handleBurstComplete(burst.id)}
        />
      ))}
    </ConfettiContext.Provider>
  );
};

export const useConfettiCelebration = (): ConfettiContextValue => {
  const context = useContext(ConfettiContext);

  if (!context) {
    throw new Error('useConfettiCelebration must be used within ConfettiProvider');
  }

  return context;
};
