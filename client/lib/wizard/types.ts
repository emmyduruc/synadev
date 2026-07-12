import type { ReactNode } from 'react';

export type WizardStepRenderProps<TContext> = {
  context: TContext;
  updateContext: (patch: Partial<TContext>) => void;
  goNext: () => void;
  goPrevious: () => void;
};

export type WizardStepDefinition<TContext> = {
  id: string;
  canProceed?: (context: TContext) => boolean;
  render: (props: WizardStepRenderProps<TContext>) => ReactNode;
};

export type WizardConfig<TContext> = {
  steps: readonly WizardStepDefinition<TContext>[];
  initialContext: TContext;
  skippable?: boolean;
  onSkip?: () => void;
  onComplete: (context: TContext) => void | Promise<void>;
};
