import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PatientActivationMeasureIntro } from '@/components/patientActivationMeasure/PatientActivationMeasureIntro';
import { PatientActivationMeasureQuestionCard } from '@/components/patientActivationMeasure/PatientActivationMeasureQuestionCard';
import { Box } from '@/components/ui/Box';
import { ModalCancelSaveFooter } from '@/components/ui/ModalCancelSaveFooter';
import { Text } from '@/components/ui/Text';
import {
  PATIENT_ACTIVATION_MEASURE_WIZARD_PHASE,
  usePatientActivationMeasureWizard,
} from '@/hooks/usePatientActivationMeasureWizard';
import { useTranslate } from '@/hooks/useTranslate';
import { PATIENT_ACTIVATION_MEASURE_ITEM_COUNT } from '@/lib/patientActivationMeasure/patientActivationMeasureCatalog';
import type { PatientActivationMeasureSubmissionPayload } from '@/lib/patientActivationMeasure/patientActivationMeasureTypes';

export type PatientActivationMeasureWizardProps = {
  onClose: () => void;
  onSave: (payload: PatientActivationMeasureSubmissionPayload) => void | Promise<void>;
};

export const PatientActivationMeasureWizard = ({
  onClose,
  onSave,
}: PatientActivationMeasureWizardProps) => {
  const { t } = useTranslate();
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets();
  const {
    phase,
    currentItem,
    currentAnswer,
    canAdvanceQuestion,
    isLastQuestion,
    isSaving,
    setIsSaving,
    setItemAnswer,
    goToQuestions,
    goToIntro,
    goToPreviousQuestion,
    goToNextQuestion,
    buildPayload,
  } = usePatientActivationMeasureWizard();

  const isIntro = phase === PATIENT_ACTIVATION_MEASURE_WIZARD_PHASE.intro;

  const handlePrimary = async () => {
    if (isIntro) {
      goToQuestions();
      return;
    }

    if (!canAdvanceQuestion) {
      return;
    }

    if (!isLastQuestion) {
      goToNextQuestion();
      return;
    }

    const payload = buildPayload();

    if (!payload || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      await onSave(payload);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSecondary = () => {
    if (isIntro) {
      onClose();
      return;
    }

    if (currentItem.index <= 1) {
      goToIntro();
      return;
    }

    goToPreviousQuestion();
  };

  const primaryLabelKey = (() => {
    if (isIntro) {
      return 'wizard_next_button';
    }

    if (isLastQuestion) {
      return 'patient_activation_measure_save_button';
    }

    return 'patient_activation_measure_further_button';
  })();

  const progressRatio = isIntro
    ? 0
    : currentItem.index / PATIENT_ACTIVATION_MEASURE_ITEM_COUNT;

  return (
    <Box flex={1} fullWidth background="background">
      <Box style={{ paddingTop: safeAreaTop }}>
        <Box className="h-1 w-full bg-border">
          <Box
            className="h-1 bg-primary-600"
            style={{ width: `${Math.max(progressRatio * 100, isIntro ? 4 : 0)}%` }}
          />
        </Box>
        <Box align="center" paddingX="lg" paddingY="sm">
          <Text size="lg" weight="bold">
            {t('patient_activation_measure_wizard_header')}
          </Text>
        </Box>
      </Box>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 24 }}>
        {isIntro ? (
          <PatientActivationMeasureIntro />
        ) : (
          <Box gap="md" paddingX="lg" paddingY="md">
            <Box gap="sm">
              <Text size="2xl" weight="bold" className="leading-tight">
                {t('patient_activation_measure_questionnaire_title')}
              </Text>
              <Text size="sm" color="foreground" className="leading-relaxed">
                {t('patient_activation_measure_questionnaire_subtitle')}
              </Text>
            </Box>
            <PatientActivationMeasureQuestionCard
              item={currentItem}
              value={currentAnswer}
              onChange={(value) => setItemAnswer(currentItem.id, value)}
            />
            <Text size="xs" color="foreground" className="leading-relaxed">
              {t('patient_activation_measure_medical_disclaimer')}
            </Text>
          </Box>
        )}
      </ScrollView>

      <Box style={{ paddingBottom: safeAreaBottom }}>
        <ModalCancelSaveFooter
          onCancel={handleSecondary}
          onSave={() => {
            void handlePrimary();
          }}
          isSaving={isSaving}
          saveDisabled={!isIntro && !canAdvanceQuestion}
          cancelLabelKey="wizard_previous_button"
          saveLabelKey={primaryLabelKey}
        />
      </Box>
    </Box>
  );
};
