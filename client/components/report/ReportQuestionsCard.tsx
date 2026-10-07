import { View } from 'react-native';

import { Box } from '@/components/ui/Box';
import { ChevronRightIcon } from '@/components/ui/icons/ChevronRightIcon';
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
import { cn, semanticColors } from '@/lib/ui';

export type ReportQuestionsCardProps = {
  selectedQuestionIds?: readonly ReportDoctorQuestionId[];
  customQuestions?: readonly string[];
  selectedConcernIds?: readonly ReportConcernId[];
  concernFreeText?: string;
  onPressAddQuestions?: () => void;
  onPressAddConcerns?: () => void;
};

const noop = () => undefined;

export const ReportQuestionsCard = ({
  selectedQuestionIds = [],
  customQuestions = [],
  selectedConcernIds = [],
  concernFreeText = '',
  onPressAddQuestions = noop,
  onPressAddConcerns = noop,
}: ReportQuestionsCardProps) => {
  const { t } = useTranslate();
  const hasSelectedQuestions =
    selectedQuestionIds.length > 0 || customQuestions.length > 0;
  const trimmedConcernFreeText = concernFreeText.trim();
  const hasSelectedConcerns =
    selectedConcernIds.length > 0 || trimmedConcernFreeText.length > 0;

  return (
    <Box className="overflow-hidden rounded-2xl border border-border bg-card">
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={t('report_questions_add')}
        onPress={onPressAddQuestions}
        className={cn('px-4 py-4', !hasSelectedQuestions && 'bg-lavender-light')}>
        <Box gap="md">
          <Text size="base" weight="bold" family="serif" className="leading-tight">
            {t('report_questions_heading')}
          </Text>

          {hasSelectedQuestions ? (
            <Box gap="sm">
              {selectedQuestionIds.map((questionId) => (
                <Box
                  key={questionId}
                  className="rounded-xl bg-primary-50 px-3.5 py-3">
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

          <Box direction="row" align="center" gap="md">
            <Box flex={1}>
              <Text size="sm" weight="normal" family="sans" className="leading-snug">
                {t('report_questions_add')}
              </Text>
            </Box>
            <ChevronRightIcon size={16} color={semanticColors.foregroundMuted} />
          </Box>
        </Box>
      </TouchableOpacity>

      <View
        style={{
          height: 1,
          backgroundColor: semanticColors.report.hairline,
        }}
      />

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={t('report_concerns_add')}
        onPress={onPressAddConcerns}
        className={cn('px-4 py-4', !hasSelectedConcerns && 'bg-lavender-light')}>
        <Box gap="md">
          <Text size="base" weight="bold" family="serif" className="leading-tight">
            {t('report_concerns_heading')}
          </Text>

          {hasSelectedConcerns ? (
            <Box gap="sm">
              {selectedConcernIds.map((concernId) => (
                <Box
                  key={concernId}
                  className="rounded-xl bg-primary-50 px-3.5 py-3">
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

          <Box direction="row" align="center" gap="md">
            <Box flex={1}>
              <Text size="sm" weight="normal" family="sans" className="leading-snug">
                {t('report_concerns_add')}
              </Text>
            </Box>
            <ChevronRightIcon size={16} color={semanticColors.foregroundMuted} />
          </Box>
        </Box>
      </TouchableOpacity>
    </Box>
  );
};
