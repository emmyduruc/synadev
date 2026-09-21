import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { INTRO_TOTAL_STEPS } from '@/lib/intro/constants';

export type IntroStepperProps = {
  /** 1-based step index for display. */
  currentStep: number;
};

export const IntroStepper = ({ currentStep }: IntroStepperProps) => (
  <Box direction="row" align="center" justify="center" className="gap-2">
    {Array.from({ length: INTRO_TOTAL_STEPS }, (_, index) => {
      const stepNumber = index + 1;
      const isActive = stepNumber === currentStep;

      if (isActive) {
        return <Box key={stepNumber} className="h-1.5 w-6 rounded-full bg-foreground" />;
      }

      return <Box key={stepNumber} className="h-1.5 w-1.5 rounded-full bg-neutral-300" />;
    })}
    <Text size="xs" color="foreground-muted" className="ml-1">
      {`${currentStep}/${INTRO_TOTAL_STEPS}`}
    </Text>
  </Box>
);
