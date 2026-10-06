import { ScrollView } from 'react-native';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import {
  REPORT_DOCTOR_QUESTION_CATEGORY_LABEL_KEY,
  REPORT_DOCTOR_QUESTION_CATEGORY_ORDER,
  type ReportDoctorQuestionCategoryId,
} from '@/lib/report/reportDoctorQuestions';
import { semanticColors } from '@/lib/ui';

export type ReportDoctorQuestionCategoryChipsProps = {
  activeCategoryId: ReportDoctorQuestionCategoryId;
  onChangeCategory: (categoryId: ReportDoctorQuestionCategoryId) => void;
};

export const ReportDoctorQuestionCategoryChips = ({
  activeCategoryId,
  onChangeCategory,
}: ReportDoctorQuestionCategoryChipsProps) => {
  const { t } = useTranslate();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Box direction="row" gap="sm" className="pr-2">
        {REPORT_DOCTOR_QUESTION_CATEGORY_ORDER.map((categoryId) => {
          const isActive = categoryId === activeCategoryId;

          return (
            <TouchableOpacity
              key={categoryId}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              onPress={() => onChangeCategory(categoryId)}
              className="rounded-full border px-4 py-3"
              style={{
                backgroundColor: isActive ? semanticColors.ink2 : semanticColors.card,
                borderColor: isActive ? semanticColors.ink2 : semanticColors.border,
              }}>
              <Text
                size="sm"
                weight="medium"
                responsive={false}
                style={{ color: isActive ? semanticColors.card : semanticColors.ink2 }}>
                {t(REPORT_DOCTOR_QUESTION_CATEGORY_LABEL_KEY[categoryId])}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Box>
    </ScrollView>
  );
};
