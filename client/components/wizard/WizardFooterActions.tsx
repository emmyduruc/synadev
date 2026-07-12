import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { useTranslate } from '@/hooks/useTranslate';

export type WizardFooterActionsProps = {
  onNext: () => void;
  onPrevious?: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  isSubmitting?: boolean;
  nextLabel?: string;
  previousLabel?: string;
  showPrevious?: boolean;
};

export const WizardFooterActions = ({
  onNext,
  onPrevious,
  canGoNext = true,
  isSubmitting = false,
  nextLabel,
  showPrevious = true,
}: WizardFooterActionsProps) => {
  const { t } = useTranslate();

  return (
    <Box direction="row" gap="sm" paddingX="lg">
      {/* {showPrevious && onPrevious ? (
      should remain in the codebase for future reference
        <Button
          variant="outline"
          size="lg"
          disabled={!canGoPrevious || isSubmitting}
          onPress={onPrevious}
          className="flex-1 w-full">
          {previousLabel ?? t('wizard_previous_button')}
        </Button>
      ) : null} */}
      <Button
        size="lg"
        fullWidth={!showPrevious || !onPrevious}
        className={showPrevious && onPrevious ? 'flex-1' : undefined}
        loading={isSubmitting}
        disabled={!canGoNext}
        onPress={onNext}>
        {nextLabel ?? t('wizard_next_button')}
      </Button>
    </Box>
  );
};
