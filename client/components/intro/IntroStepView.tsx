import type { ReactNode } from 'react';

import { IntroGradientBackground } from '@/components/intro/IntroGradientBackground';
import { IntroStepper } from '@/components/intro/IntroStepper';
import { SAFE_AREA_EDGES, SafeAreaScreen } from '@/components/layout/SafeAreaScreen';
import { Box, Button, Text } from '@/components/ui';
import { useTranslate } from '@/hooks/useTranslate';

export type IntroStepViewProps = {
  currentStep: number;
  titleKey: string;
  bodyKey: string;
  ctaKey: string;
  illustration: ReactNode;
  onFurther: () => void;
};

export const IntroStepView = ({
  currentStep,
  titleKey,
  bodyKey,
  ctaKey,
  illustration,
  onFurther,
}: IntroStepViewProps) => {
  const { t } = useTranslate();

  return (
    <IntroGradientBackground>
      <SafeAreaScreen edges={SAFE_AREA_EDGES.all} style={{ backgroundColor: 'transparent' }}>
        <Box flex={1} className="px-6 pb-4 pt-2">
          <Box align="center" className="mb-4 pt-2">
            <Text
              size="lg"
              weight="medium"
              color="foreground"
              className="tracking-[0.35em]"
            >
              SYNA
            </Text>
          </Box>

          <Box className="mb-8 h-72">{illustration}</Box>

          <Box flex={1} className="px-1">
            <Text
              size="2xl"
              weight="semibold"
              align="center"
              color="foreground"
              className="mb-3 leading-snug"
            >
              {t(titleKey)}
            </Text>
            <Text
              size="sm"
              weight="normal"
              align="center"
              color="foreground"
              className="mb-8 leading-relaxed"
            >
              {t(bodyKey)}
            </Text>

            <IntroStepper currentStep={currentStep} />
          </Box>

          <Button fullWidth size="lg" onPress={onFurther}>
            {t(ctaKey)}
          </Button>
        </Box>
      </SafeAreaScreen>
    </IntroGradientBackground>
  );
};
