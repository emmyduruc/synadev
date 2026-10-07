import { useRef } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MrsIiQuestionStep } from '@/components/mrs/MrsIiQuestionStep';
import { Box } from '@/components/ui/Box';
import { useMenopauseScaleWizard } from '@/hooks/useMenopauseScaleWizard';
import { buildMrsIiSubmissionPayload } from '@/lib/mrs/mrsIiScoring';
import type {
  MrsIiAnswersByItem,
  MrsIiSeverityValue,
  MrsIiSubmissionPayload,
} from '@/lib/mrs/mrsIiTypes';
import { semanticColors } from '@/lib/ui';

export type MenopauseScaleWizardProps = {
  onSave: (payload: MrsIiSubmissionPayload) => void | Promise<void>;
};

const ADVANCE_DELAY_MS = 220;

/**
 * Full-screen MRS-II wizard: one question per step with auto-advance.
 * Uses explicit safe-area insets because SafeAreaView edges are unreliable
 * inside fullScreenModal.
 */
export const MenopauseScaleWizard = ({ onSave }: MenopauseScaleWizardProps) => {
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets();
  const {
    questionNumber,
    currentItem,
    currentAnswer,
    answers,
    isLastQuestion,
    isSaving,
    setIsSaving,
    setItemAnswer,
    goToNextQuestion,
  } = useMenopauseScaleWizard();
  const isAdvancingRef = useRef(false);

  const handleSelect = (value: MrsIiSeverityValue) => {
    if (isSaving || isAdvancingRef.current) {
      return;
    }

    const nextAnswers: MrsIiAnswersByItem = {
      ...answers,
      [currentItem.id]: value,
    };

    setItemAnswer(currentItem.id, value);
    isAdvancingRef.current = true;

    setTimeout(() => {
      void (async () => {
        try {
          if (!isLastQuestion) {
            goToNextQuestion();
            return;
          }

          const payload = buildMrsIiSubmissionPayload(nextAnswers);

          if (!payload) {
            return;
          }

          setIsSaving(true);
          await onSave(payload);
        } finally {
          setIsSaving(false);
          isAdvancingRef.current = false;
        }
      })();
    }, ADVANCE_DELAY_MS);
  };

  return (
    <Box
      flex={1}
      fullWidth
      style={{ backgroundColor: semanticColors.page.DEFAULT }}>
      <Box style={{ paddingTop: safeAreaTop }} flex={1}>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: safeAreaBottom + 16 }}>
          <MrsIiQuestionStep
            item={currentItem}
            questionNumber={questionNumber}
            value={currentAnswer}
            disabled={isSaving}
            onSelect={handleSelect}
          />
        </ScrollView>
      </Box>
    </Box>
  );
};
