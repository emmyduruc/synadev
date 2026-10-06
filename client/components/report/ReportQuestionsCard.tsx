import { View } from 'react-native';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { semanticColors } from '@/lib/ui';

export type ReportQuestionsCardProps = {
  onPressAddQuestions?: () => void;
  onPressAddConcerns?: () => void;
};

export const ReportQuestionsCard = ({
  onPressAddQuestions,
  onPressAddConcerns,
}: ReportQuestionsCardProps) => {
  const { t } = useTranslate();

  return (
    <Box className="overflow-hidden rounded-2xl border border-border bg-card">
      <Box className="px-4 py-4" gap="sm">
        <Text size="base" weight="bold" className="leading-tight">
          {t('report_questions_heading')}
        </Text>
        <Text size="sm" color="foreground-muted" className="leading-relaxed">
          {t('report_questions_empty')}
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={onPressAddQuestions ?? (() => undefined)}
          className="items-center py-1">
          <Text size="sm" weight="medium" color="primary" align="center">
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
        <Text size="sm" color="foreground-muted" className="leading-relaxed">
          {t('report_concerns_empty')}
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={onPressAddConcerns ?? (() => undefined)}
          className="items-center py-1">
          <Text size="sm" weight="medium" color="primary" align="center">
            {t('report_concerns_add')}
          </Text>
        </TouchableOpacity>
      </Box>
    </Box>
  );
};
