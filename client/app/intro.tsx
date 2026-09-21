import { IntroStepView } from '@/components/intro/IntroStepView';
import { useIntroFlow } from '@/hooks/useIntroFlow';

const IntroScreen = () => {
  const { currentStep, titleKey, bodyKey, Illustration, goFurther } = useIntroFlow();

  return (
    <IntroStepView
      currentStep={currentStep}
      titleKey={titleKey}
      bodyKey={bodyKey}
      illustration={<Illustration />}
      onFurther={() => {
        void goFurther();
      }}
    />
  );
};

export default IntroScreen;
