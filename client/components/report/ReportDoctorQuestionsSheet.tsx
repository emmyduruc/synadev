import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ReportDoctorOwnQuestionsSection } from '@/components/report/ReportDoctorOwnQuestionsSection';
import { ReportDoctorQuestionCategoryChips } from '@/components/report/ReportDoctorQuestionCategoryChips';
import { ReportDoctorQuestionOption } from '@/components/report/ReportDoctorQuestionOption';
import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import {
  REPORT_DOCTOR_QUESTION_CATEGORY,
  REPORT_DOCTOR_QUESTION_MAX_SELECTED,
  getReportDoctorQuestionsForCategory,
  type ReportDoctorQuestionCategoryId,
  type ReportDoctorQuestionId,
} from '@/lib/report/reportDoctorQuestions';
import { semanticColors } from '@/lib/ui';

export type ReportDoctorQuestionsSelection = {
  questionIds: readonly ReportDoctorQuestionId[];
  customQuestions: readonly string[];
};

export type ReportDoctorQuestionsSheetProps = {
  visible: boolean;
  selectedQuestionIds: readonly ReportDoctorQuestionId[];
  customQuestions?: readonly string[];
  onClose: () => void;
  onApply: (selection: ReportDoctorQuestionsSelection) => void;
};

export const ReportDoctorQuestionsSheet = ({
  visible,
  selectedQuestionIds,
  customQuestions = [],
  onClose,
  onApply,
}: ReportDoctorQuestionsSheetProps) => {
  const { t } = useTranslate();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const [activeCategoryId, setActiveCategoryId] = useState<ReportDoctorQuestionCategoryId>(
    REPORT_DOCTOR_QUESTION_CATEGORY.all,
  );
  const [draftSelectedIds, setDraftSelectedIds] = useState<ReportDoctorQuestionId[]>([
    ...selectedQuestionIds,
  ]);
  const [draftCustomQuestions, setDraftCustomQuestions] = useState<string[]>([
    ...customQuestions,
  ]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setDraftSelectedIds([...selectedQuestionIds]);
    setDraftCustomQuestions([...customQuestions]);
    setActiveCategoryId(REPORT_DOCTOR_QUESTION_CATEGORY.all);
  }, [customQuestions, selectedQuestionIds, visible]);

  const questions = useMemo(
    () => getReportDoctorQuestionsForCategory(activeCategoryId),
    [activeCategoryId],
  );

  const selectedCount = draftSelectedIds.length + draftCustomQuestions.length;
  const canAddMore = selectedCount < REPORT_DOCTOR_QUESTION_MAX_SELECTED;
  const floatingFooterHeight = 108 + safeAreaBottom;

  const handleToggle = (optionId: string) => {
    const questionId = optionId as ReportDoctorQuestionId;

    setDraftSelectedIds((previous) => {
      if (previous.includes(questionId)) {
        return previous.filter((id) => id !== questionId);
      }

      if (previous.length + draftCustomQuestions.length >= REPORT_DOCTOR_QUESTION_MAX_SELECTED) {
        return previous;
      }

      return [...previous, questionId];
    });
  };

  const handleAcceptCustomQuestion = (question: string) => {
    setDraftCustomQuestions((previous) => {
      if (previous.length + draftSelectedIds.length >= REPORT_DOCTOR_QUESTION_MAX_SELECTED) {
        return previous;
      }

      if (previous.includes(question)) {
        return previous;
      }

      return [...previous, question];
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
        <Pressable
          className="max-h-[92%]"
          onPress={(event) => event.stopPropagation()}
          style={{ backgroundColor: semanticColors.page.DEFAULT }}>
          <Box
            className="rounded-t-3xl"
            style={{
              backgroundColor: semanticColors.page.DEFAULT,
              maxHeight: '100%',
            }}>
            <Box className="items-center px-5 pt-3 pb-2">
              <View className="h-1 w-10 rounded-full bg-border" />
            </Box>

            <Box className="px-5 pb-3" gap="xs">
              <Text size="xl" weight="bold" className="leading-tight">
                {t('report_doctor_questions_sheet_title')}
              </Text>
              <Text size="sm" color="foreground-subtle" className="leading-relaxed">
                {t('report_doctor_questions_sheet_subtitle')}
              </Text>
            </Box>

            <Box className="px-5 pb-3">
              <ReportDoctorQuestionCategoryChips
                activeCategoryId={activeCategoryId}
                onChangeCategory={setActiveCategoryId}
              />
            </Box>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: floatingFooterHeight,
                gap: 10,
              }}>
              {questions.map((question) => (
                <ReportDoctorQuestionOption
                  key={question.id}
                  id={question.id}
                  labelKey={question.labelKey}
                  isSelected={draftSelectedIds.includes(question.id)}
                  onToggle={handleToggle}
                />
              ))}

              <ReportDoctorOwnQuestionsSection
                customQuestions={draftCustomQuestions}
                canAddMore={canAddMore}
                isActive={visible}
                onAcceptCustomQuestion={handleAcceptCustomQuestion}
              />

              <Box className="mt-2 rounded-2xl border border-border bg-card px-4 py-4" gap="xs">
                <Text size="xs" color="foreground-subtle" className="leading-relaxed">
                  {t('report_notice_label')}
                </Text>
                <Text size="sm" color="foreground" className="leading-relaxed">
                  {t('report_doctor_questions_notice_body')}
                </Text>
              </Box>
            </ScrollView>

            <View
              pointerEvents="box-none"
              className="absolute inset-x-0 bottom-0 px-5 pt-3"
              style={{
                paddingBottom: safeAreaBottom + 12,
                backgroundColor: semanticColors.page.DEFAULT,
              }}>
              <Text size="xs" color="foreground-subtle" className="mb-2 leading-relaxed">
                {t('report_doctor_questions_selected_count', {
                  count: selectedCount,
                  max: REPORT_DOCTOR_QUESTION_MAX_SELECTED,
                })}
              </Text>
              <Button
                fullWidth
                size="lg"
                onPress={() =>
                  onApply({
                    questionIds: draftSelectedIds,
                    customQuestions: draftCustomQuestions,
                  })
                }
                className="border-0"
                style={{ backgroundColor: semanticColors.ink2 }}
                textClassName="text-white">
                {t('report_doctor_questions_apply')}
              </Button>
            </View>
          </Box>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
