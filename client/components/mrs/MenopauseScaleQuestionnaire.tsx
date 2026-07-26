import { MrsIiSubscaleAccordion } from '@/components/mrs/MrsIiSubscaleAccordion';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { MRS_II_ITEM_COUNT } from '@/lib/mrs/mrsIiCatalog';
import type {
  MrsIiAnswersByItem,
  MrsIiItemId,
  MrsIiSeverityValue,
} from '@/lib/mrs/mrsIiTypes';

export type MenopauseScaleQuestionnaireProps = {
  answers: MrsIiAnswersByItem;
  answeredCount: number;
  onChangeItem: (itemId: MrsIiItemId, value: MrsIiSeverityValue) => void;
};

export const MenopauseScaleQuestionnaire = ({
  answers,
  answeredCount,
  onChangeItem,
}: MenopauseScaleQuestionnaireProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="md" paddingX="lg" paddingY="md">
      <Box gap="sm">
        <Text size="2xl" weight="bold" className="leading-tight">
          {t('mrs_ii_questionnaire_title')}
        </Text>
        <Text size="sm" color="foreground" className="leading-relaxed">
          {t('mrs_ii_questionnaire_subtitle')}
        </Text>
        <Text size="xs" weight="semibold" color="foreground">
          {t('mrs_ii_progress_label', {
            answered: answeredCount,
            total: MRS_II_ITEM_COUNT,
          })}
        </Text>
      </Box>

      <MrsIiSubscaleAccordion answers={answers} onChangeItem={onChangeItem} />
    </Box>
  );
};
