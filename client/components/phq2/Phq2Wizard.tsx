import type { SubmitPhq2Assessment } from '@syna/shared-types';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Phq2Intro } from '@/components/phq2/Phq2Intro';
import { Phq2QuestionCard } from '@/components/phq2/Phq2QuestionCard';
import { Box } from '@/components/ui/Box';
import { ModalCancelSaveFooter } from '@/components/ui/ModalCancelSaveFooter';
import { Text } from '@/components/ui/Text';
import { PHQ2_WIZARD_PHASE, usePhq2Wizard } from '@/hooks/usePhq2Wizard';
import { useTranslate } from '@/hooks/useTranslate';

export type Phq2WizardProps = {
  onClose: () => void;
  onSave: (payload: SubmitPhq2Assessment) => void | Promise<void>;
};

export const Phq2Wizard = ({ onClose, onSave }: Phq2WizardProps) => {
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
  } = usePhq2Wizard();

  const isIntro = phase === PHQ2_WIZARD_PHASE.intro;

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

  let primaryLabelKey = 'wizard_next_button';

  if (!isIntro && isLastQuestion) {
    primaryLabelKey = 'phq2_save_button';
  } else if (!isIntro) {
    primaryLabelKey = 'phq2_further_button';
  }

  return (
    <Box flex={1} background="background" style={{ paddingTop: safeAreaTop }}>
      <Box align="center" paddingX="lg" className="pt-4 pb-2">
        <Text size="lg" weight="bold" align="center">
          {t('phq2_screen_title')}
        </Text>
      </Box>

      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}>
        {isIntro ? (
          <Phq2Intro />
        ) : (
          <Phq2QuestionCard
            item={currentItem}
            answer={currentAnswer}
            onChange={(value) => setItemAnswer(currentItem.id, value)}
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
          cancelLabelKey="wizard_previous_button"
          saveLabelKey={primaryLabelKey}
          saveDisabled={!isIntro && !canAdvanceQuestion}
        />
      </Box>
    </Box>
  );
};
