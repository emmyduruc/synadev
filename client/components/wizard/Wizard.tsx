import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/Box';
import { WizardFooterActions } from '@/components/wizard/WizardFooterActions';
import { WizardShell } from '@/components/wizard/WizardShell';
import { useTranslate } from '@/hooks/useTranslate';
import type { WizardConfig, WizardStepRenderProps } from '@/lib/wizard/types';

export type WizardProps<TContext> = WizardConfig<TContext> & {
  renderFooter?: (props: {
    onNext: () => void;
    onPrevious: () => void;
    canGoNext: boolean;
    canGoPrevious: boolean;
    isSubmitting: boolean;
    isLastStep: boolean;
  }) => ReactNode;
};

export const Wizard = <TContext,>({
  steps,
  initialContext,
  skippable = false,
  onSkip,
  onComplete,
  renderFooter,
}: WizardProps<TContext>) => {
  const { t } = useTranslate();
  const [stepIndex, setStepIndex] = useState(0);
  const [context, setContext] = useState(initialContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStep = steps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === steps.length - 1;

  const canGoNext = currentStep?.canProceed ? currentStep.canProceed(context) : true;

  const updateContext = useCallback((patch: Partial<TContext>) => {
    setContext((previous) => ({ ...previous, ...patch }));
  }, []);

  const goNext = useCallback(async () => {
    if (!canGoNext || isSubmitting || !currentStep) {
      return;
    }

    if (!isLastStep) {
      setStepIndex((previous) => previous + 1);
      return;
    }

    setIsSubmitting(true);

    try {
      await onComplete(context);
    } finally {
      setIsSubmitting(false);
    }
  }, [canGoNext, context, currentStep, isLastStep, isSubmitting, onComplete]);

  const goPrevious = useCallback(() => {
    if (isFirstStep || isSubmitting) {
      return;
    }

    setStepIndex((previous) => previous - 1);
  }, [isFirstStep, isSubmitting]);

  const stepRenderProps: WizardStepRenderProps<TContext> = useMemo(
    () => ({
      context,
      updateContext,
      goNext: () => {
        void goNext();
      },
      goPrevious,
    }),
    [context, goNext, goPrevious, updateContext],
  );

  const defaultFooter = (
    <WizardFooterActions
      onNext={() => {
        void goNext();
      }}
      onPrevious={goPrevious}
      canGoNext={canGoNext}
      canGoPrevious={!isFirstStep}
      showPrevious={!isFirstStep}
      isSubmitting={isSubmitting}
      nextLabel={isLastStep ? t('wizard_finish_button') : t('wizard_next_button')}
    />
  );

  if (!currentStep) {
    return null;
  }

  return (
    <Box flex={1} fullWidth background="background">
      <SafeAreaView className="flex-1">
        <WizardShell
          skippable={skippable}
          onSkip={onSkip}
          stepLabel={t('wizard_step_progress', {
            current: stepIndex + 1,
            total: steps.length,
          })}
          footer={
            renderFooter
              ? renderFooter({
                  onNext: () => {
                    void goNext();
                  },
                  onPrevious: goPrevious,
                  canGoNext,
                  canGoPrevious: !isFirstStep,
                  isSubmitting,
                  isLastStep,
                })
              : defaultFooter
          }>
          {currentStep.render(stepRenderProps)}
        </WizardShell>
      </SafeAreaView>
    </Box>
  );
};
