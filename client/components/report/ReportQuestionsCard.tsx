import { View } from 'react-native';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import {
  REPORT_CONCERNS,
  type ReportConcernId,
} from '@/lib/report/reportConcerns';
import {
  REPORT_DOCTOR_QUESTIONS,
  type ReportDoctorQuestionId,
} from '@/lib/report/reportDoctorQuestions';
import { semanticColors } from '@/lib/ui';

export type ReportQuestionsCardProps = {
  selectedQuestionIds?: readonly ReportDoctorQuestionId[];
  customQuestions?: readonly string[];
  selectedConcernIds?: readonly ReportConcernId[];
  concernFreeText?: string;
  onPressAddQuestions?: () => void;
  onPressAddConcerns?: () => void;
};

export const ReportQuestionsCard = ({
  selectedQuestionIds = [],
  customQuestions = [],
  selectedConcernIds = [],
  concernFreeText = '',
  onPressAddQuestions,
  onPressAddConcerns,
}: ReportQuestionsCardProps) => {
  const { t } = useTranslate();
  const hasSelectedQuestions =
    selectedQuestionIds.length > 0 || customQuestions.length > 0;
  const trimmedConcernFreeText = concernFreeText.trim();
  const hasSelectedConcerns =
    selectedConcernIds.length > 0 || trimmedConcernFreeText.length > 0;

  return (
    <Box className="overflow-hidden rounded-2xl border border-border bg-card">
      <Box className="px-4 py-4" gap="md">
        <Text size="base" weight="bold" className="leading-tight">
          {t('report_questions_heading')}
        </Text>

        {hasSelectedQuestions ? (
          <Box gap="sm">
            {selectedQuestionIds.map((questionId) => (
              <Box key={questionId} className="rounded-xl bg-primary-50 px-3.5 py-3">
                <Text size="sm" color="foreground" className="leading-relaxed">
                  {t(REPORT_DOCTOR_QUESTIONS[questionId].labelKey)}
                </Text>
              </Box>
            ))}
            {customQuestions.map((question) => (
              <Box key={question} className="rounded-xl bg-primary-50 px-3.5 py-3">
                <Text size="sm" color="foreground" className="leading-relaxed">
                  {question}
                </Text>
              </Box>
            ))}
          </Box>
        ) : (
          <Text size="sm" color="foreground-muted" className="leading-relaxed">
            {t('report_questions_empty')}
          </Text>
        )}

        <TouchableOpacity
          accessibilityRole="button"
          onPress={onPressAddQuestions ?? (() => undefined)}
          className="items-center py-1">
          <Text size="sm" weight="medium" color="foreground" align="center">
            {t('report_questions_add')}
          </Text>
        </TouchableOpacity>
      </Box>

      <View
        style={{
          height: 1,
          backgroundColor: semanticColors.report.hairline,
        }}
      />

      <Box className="px-4 py-4" gap="sm">
        <Text size="base" weight="bold" className="leading-tight">
          {t('report_concerns_heading')}
        </Text>

        {hasSelectedConcerns ? (
          <Box gap="sm">
            {selectedConcernIds.map((concernId) => (
              <Box key={concernId} className="rounded-xl bg-primary-50 px-3.5 py-3">
                <Text size="sm" color="foreground" className="leading-relaxed">
                  {t(REPORT_CONCERNS[concernId].labelKey)}
                </Text>
              </Box>
            ))}
            {trimmedConcernFreeText.length > 0 ? (
              <Box className="rounded-xl bg-primary-50 px-3.5 py-3">
                <Text size="sm" color="foreground" className="leading-relaxed">
                  {trimmedConcernFreeText}
                </Text>
              </Box>
            ) : null}
          </Box>
        ) : (
          <Text size="sm" color="foreground-muted" className="leading-relaxed">
            {t('report_concerns_empty')}
          </Text>
        )}

        <TouchableOpacity
          accessibilityRole="button"
          onPress={onPressAddConcerns ?? (() => undefined)}
          className="items-center py-1">
          <Text size="sm" weight="medium" color="foreground" align="center">
            {t('report_concerns_add')}
          </Text>
        </TouchableOpacity>
      </Box>
    </Box>
  );
};
