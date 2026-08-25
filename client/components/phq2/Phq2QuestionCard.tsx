import type { Phq2SeverityValue } from '@syna/shared-types';

import { Phq2ResponseOptions } from '@/components/phq2/Phq2ResponseOptions';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import type { Phq2Item } from '@/lib/phq2/phq2Catalog';
import { PHQ2_ITEMS } from '@/lib/phq2/phq2Catalog';

export type Phq2QuestionCardProps = {
  item: Phq2Item;
  answer: Phq2SeverityValue | null;
  onChange: (value: Phq2SeverityValue) => void;
};

export const Phq2QuestionCard = ({
  item,
  answer,
  onChange,
}: Phq2QuestionCardProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="lg" paddingX="lg" className="pt-2">
      <Text size="xs" color="foreground-muted" align="center">
        {t('phq2_progress_label', {
          current: item.index,
          total: PHQ2_ITEMS.length,
        })}
      </Text>
      <Text size="lg" weight="semibold" align="center" className="leading-7">
        {t(item.titleKey)}
      </Text>
      <Text size="xs" color="foreground-muted" align="center">
        {t('phq2_prompt_over_two_weeks')}
      </Text>
      <Phq2ResponseOptions value={answer} onChange={onChange} />
    </Box>
  );
};
