import { useEffect, useState } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';

import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { TextInput } from '@/components/ui/TextInput';
import { useTranslate } from '@/hooks/useTranslate';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type ReportDoctorOwnQuestionsSectionProps = {
  customQuestions: readonly string[];
  canAddMore: boolean;
  /** When false, collapses the composer (e.g. sheet closed). */
  isActive?: boolean;
  onAcceptCustomQuestion: (question: string) => void;
  onPressImportant?: () => void;
};

export const ReportDoctorOwnQuestionsSection = ({
  customQuestions,
  canAddMore,
  isActive = true,
  onAcceptCustomQuestion,
  onPressImportant,
}: ReportDoctorOwnQuestionsSectionProps) => {
  const { t } = useTranslate();
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [draftText, setDraftText] = useState('');

  useEffect(() => {
    if (isActive) {
      return;
    }

    setIsComposerOpen(false);
    setDraftText('');
  }, [isActive]);

  const openComposer = () => {
    if (!canAddMore) {
      return;
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsComposerOpen(true);
  };

  const handleAccept = () => {
    const trimmed = draftText.trim();

    if (!trimmed || !canAddMore) {
      return;
    }

    onAcceptCustomQuestion(trimmed);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDraftText('');
    setIsComposerOpen(false);
  };

  return (
    <Box className="pt-4" gap="sm">
      <Text size="sm" weight="bold" color="foreground" className="leading-tight">
        {t('report_doctor_questions_own_heading')}
      </Text>

      {customQuestions.map((question) => (
        <Box
          key={question}
          className="rounded-2xl border border-border bg-card px-3.5 py-3.5">
          <Text size="sm" color="foreground" className="leading-relaxed">
            {question}
          </Text>
        </Box>
      ))}

      {isComposerOpen ? (
        <Box gap="sm">
          <TextInput
            value={draftText}
            onChangeText={setDraftText}
            placeholder={t('report_doctor_questions_own_placeholder')}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            autoFocus
            containerClassName="w-full"
            inputClassName="min-h-[110px] py-3 bg-card"
          />
          <Text size="2xs" color="foreground-muted" className="leading-relaxed">
            {t('report_doctor_questions_own_disclaimer')}
          </Text>
          <Button
            variant="soft"
            fullWidth
            size="lg"
            onPress={handleAccept}
            disabled={draftText.trim().length === 0 || !canAddMore}>
            {t('report_doctor_questions_own_accept')}
          </Button>
        </Box>
      ) : (
        <Button
          variant="soft"
          fullWidth
          size="lg"
          onPress={openComposer}
          disabled={!canAddMore}>
          {t('report_doctor_questions_own_add')}
        </Button>
      )}

      <Button
        variant="soft"
        fullWidth
        size="lg"
        onPress={onPressImportant ?? (() => undefined)}>
        {t('report_doctor_questions_own_important')}
      </Button>
    </Box>
  );
};
