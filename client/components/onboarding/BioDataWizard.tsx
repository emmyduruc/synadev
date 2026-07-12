import { useCallback, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TextInput } from '@/components/ui/TextInput';
import { WizardDateWheel } from '@/components/wizard/WizardDateWheel';
import { WizardFooterActions } from '@/components/wizard/WizardFooterActions';
import { WizardQuestionLayout } from '@/components/wizard/WizardQuestionLayout';
import { WizardShell } from '@/components/wizard/WizardShell';
import { useTranslate } from '@/hooks/useTranslate';
import type { BioData } from '@/lib/profile/bioDataStorage';
import { EMPTY_BIO_DATA } from '@/lib/profile/bioDataStorage';
import {
  getMaxBirthDateIso,
  isAtLeastMinAge,
  parseIsoDate,
} from '@/lib/profile/bioDataValidation';

const BIO_WIZARD_STEP = {
  firstName: 'first_name',
  lastName: 'last_name',
  dateOfBirth: 'date_of_birth',
} as const;

type BioWizardStepId = (typeof BIO_WIZARD_STEP)[keyof typeof BIO_WIZARD_STEP];

const BIO_WIZARD_STEPS: readonly BioWizardStepId[] = [
  BIO_WIZARD_STEP.firstName,
  BIO_WIZARD_STEP.lastName,
  BIO_WIZARD_STEP.dateOfBirth,
];

export type BioDataWizardProps = {
  initialBioData?: BioData;
  skippable?: boolean;
  onSkip?: () => void;
  onComplete: (bioData: BioData) => void | Promise<void>;
};

export const BioDataWizard = ({
  initialBioData = EMPTY_BIO_DATA,
  skippable = false,
  onSkip,
  onComplete,
}: BioDataWizardProps) => {
  const { t } = useTranslate();
  const [stepIndex, setStepIndex] = useState(0);
  const [bioData, setBioData] = useState<BioData>(initialBioData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDateValid, setIsDateValid] = useState(() => {
    const parsed = parseIsoDate(initialBioData.dateOfBirth);
    return parsed ? isAtLeastMinAge(parsed) : false;
  });

  const currentStepId = BIO_WIZARD_STEPS[stepIndex] ?? BIO_WIZARD_STEP.firstName;
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === BIO_WIZARD_STEPS.length - 1;

  const canProceed = useMemo(() => {
    if (currentStepId === BIO_WIZARD_STEP.firstName) {
      return bioData.firstName.trim().length > 0;
    }

    if (currentStepId === BIO_WIZARD_STEP.lastName) {
      return bioData.lastName.trim().length > 0;
    }

    return isDateValid;
  }, [bioData.firstName, bioData.lastName, currentStepId, isDateValid]);

  const handleNext = useCallback(async () => {
    if (!canProceed || isSubmitting) {
      return;
    }

    if (!isLastStep) {
      setStepIndex((previous) => previous + 1);
      return;
    }

    setIsSubmitting(true);

    try {
      await onComplete(bioData);
    } finally {
      setIsSubmitting(false);
    }
  }, [bioData, canProceed, isLastStep, isSubmitting, onComplete]);

  const handlePrevious = useCallback(() => {
    if (isFirstStep || isSubmitting) {
      return;
    }

    setStepIndex((previous) => previous - 1);
  }, [isFirstStep, isSubmitting]);

  const ensureDateOfBirth = bioData.dateOfBirth || getMaxBirthDateIso();

  const stepContent = (() => {
    if (currentStepId === BIO_WIZARD_STEP.firstName) {
      return (
        <WizardQuestionLayout
          eyebrow={t('wizard_bio_eyebrow')}
          title={t('wizard_bio_first_name_title')}>
          <TextInput
            key={currentStepId}
            focusKey={currentStepId}
            value={bioData.firstName}
            onChangeText={(firstName) => setBioData((previous) => ({ ...previous, firstName }))}
            autoCapitalize="words"
            autoFocus
            returnKeyType="next"
            onSubmitEditing={() => {
              if (canProceed) {
                void handleNext();
              }
            }}
            inputClassName="text-3xl font-semibold text-center"
            containerClassName="px-2"
          />
        </WizardQuestionLayout>
      );
    }

    if (currentStepId === BIO_WIZARD_STEP.lastName) {
      return (
        <WizardQuestionLayout
          eyebrow={t('wizard_bio_eyebrow')}
          title={t('wizard_bio_last_name_title')}>
          <TextInput
            key={currentStepId}
            focusKey={currentStepId}
            value={bioData.lastName}
            onChangeText={(lastName) => setBioData((previous) => ({ ...previous, lastName }))}
            autoCapitalize="words"
            autoFocus
            returnKeyType="next"
            onSubmitEditing={() => {
              if (canProceed) {
                void handleNext();
              }
            }}
            inputClassName="text-3xl font-semibold text-center"
            containerClassName="px-2"
          />
        </WizardQuestionLayout>
      );
    }

    return (
      <WizardQuestionLayout
        eyebrow={t('wizard_bio_eyebrow')}
        title={t('wizard_bio_date_of_birth_title')}>
        <WizardDateWheel
          value={ensureDateOfBirth}
          onChange={(dateOfBirth) => setBioData((previous) => ({ ...previous, dateOfBirth }))}
          onValidityChange={setIsDateValid}
        />
        {!isDateValid ? (
          <Box className="mt-2">
            <Text size="sm" color="error" align="center">
              {t('wizard_bio_age_requirement_error')}
            </Text>
          </Box>
        ) : null}
      </WizardQuestionLayout>
    );
  })();

  return (
    <Box flex={1} fullWidth background="background">
      <SafeAreaView className="flex-1">
        <WizardShell
          skippable={skippable}
          onSkip={onSkip}
          stepLabel={t('wizard_step_progress', {
            current: stepIndex + 1,
            total: BIO_WIZARD_STEPS.length,
          })}
          footer={
            <WizardFooterActions
              onNext={() => {
                void handleNext();
              }}
              onPrevious={handlePrevious}
              canGoNext={canProceed}
              canGoPrevious={!isFirstStep}
              showPrevious={!isFirstStep}
              isSubmitting={isSubmitting}
              nextLabel={isLastStep ? t('wizard_finish_button') : t('wizard_next_button')}
            />
          }>
          {stepContent}
        </WizardShell>
      </SafeAreaView>
    </Box>
  );
};
