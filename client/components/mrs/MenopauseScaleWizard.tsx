import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MenopauseScaleIntro } from '@/components/mrs/MenopauseScaleIntro';
import { MenopauseScaleQuestionnaire } from '@/components/mrs/MenopauseScaleQuestionnaire';
import { Box } from '@/components/ui/Box';
import { ModalCancelSaveFooter } from '@/components/ui/ModalCancelSaveFooter';
import { Text } from '@/components/ui/Text';
import {
  MRS_II_WIZARD_STEP,
  useMenopauseScaleWizard,
} from '@/hooks/useMenopauseScaleWizard';
import { useTranslate } from '@/hooks/useTranslate';
import type { MrsIiSubmissionPayload } from '@/lib/mrs/mrsIiTypes';

export type MenopauseScaleWizardProps = {
  onClose: () => void;
  onSave: (payload: MrsIiSubmissionPayload) => void | Promise<void>;
};

/**
 * Full-screen modal wizard. Uses explicit safe-area insets (same pattern as
 * DailyLogModal) because SafeAreaView edges are unreliable inside fullScreenModal.
 */
export const MenopauseScaleWizard = ({ onClose, onSave }: MenopauseScaleWizardProps) => {
  const { t } = useTranslate();
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets();
  const {
    step,
    answers,
    answeredCount,
    isComplete,
    isSaving,
    setIsSaving,
    setItemAnswer,
    goToQuestionnaire,
    goToIntro,
    buildPayload,
  } = useMenopauseScaleWizard();

  const isIntro = step === MRS_II_WIZARD_STEP.intro;

  const handlePrimary = async () => {
    if (isIntro) {
      goToQuestionnaire();
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

    goToIntro();
  };

  return (
    <Box flex={1} fullWidth background="background">
      <Box style={{ paddingTop: safeAreaTop }}>
        <Box align="center" paddingX="lg" paddingY="sm">
          <Text size="lg" weight="bold">
            {t('mrs_ii_wizard_header')}
          </Text>
        </Box>
      </Box>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 24 }}>
        {isIntro ? (
          <MenopauseScaleIntro />
        ) : (
          <MenopauseScaleQuestionnaire
            answers={answers}
            answeredCount={answeredCount}
            onChangeItem={setItemAnswer}
          />
        )}
      </ScrollView>

      <Box style={{ paddingBottom: safeAreaBottom }}>
        <ModalCancelSaveFooter
          onCancel={handleSecondary}
          onSave={() => {
            void handlePrimary();
          }}
          isSaving={isSaving}
          saveDisabled={!isIntro && !isComplete}
          cancelLabelKey="wizard_previous_button"
          saveLabelKey={isIntro ? 'wizard_next_button' : 'mrs_ii_save_button'}
        />
      </Box>
    </Box>
  );
};
