import { MrsIiSegmentedProgress } from '@/components/mrs/MrsIiSegmentedProgress';
import { MrsIiSeverityOptionList } from '@/components/mrs/MrsIiSeverityOptionList';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { MRS_II_ITEM_COUNT, type MrsIiItem } from '@/lib/mrs/mrsIiCatalog';
import type { MrsIiSeverityValue } from '@/lib/mrs/mrsIiTypes';

export type MrsIiQuestionStepProps = {
  item: MrsIiItem;
  questionNumber: number;
  value: MrsIiSeverityValue | null;
  disabled?: boolean;
  onSelect: (value: MrsIiSeverityValue) => void;
};

export const MrsIiQuestionStep = ({
  item,
  questionNumber,
  value,
  disabled = false,
  onSelect,
}: MrsIiQuestionStepProps) => {
  const { t } = useTranslate();

  return (
    <Box flex={1} paddingX="lg" className="pt-4" gap="lg">
      <Box gap="sm">
        <Text size="xs" color="foreground-muted" family="sans" tabularNums>
          {t('mrs_ii_question_progress_label', {
            current: questionNumber,
            total: MRS_II_ITEM_COUNT,
          })}
        </Text>
        <MrsIiSegmentedProgress total={MRS_II_ITEM_COUNT} current={questionNumber} />
      </Box>

      <Text size="xl" weight="bold" family="serif" className="leading-tight">
        {t(item.questionKey)}
      </Text>

      <MrsIiSeverityOptionList
        value={value}
        disabled={disabled}
        onSelect={onSelect}
      />
    </Box>
  );
};
