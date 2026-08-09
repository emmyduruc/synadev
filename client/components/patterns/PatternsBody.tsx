import type {
  MrsIiAssessmentSubmission,
  Pam13AssessmentSubmission,
} from '@syna/shared-types';
import type { PatternsComputation } from '@syna/shared-utils';

import { PatternsCardsContent } from '@/components/patterns/PatternsCardsContent';
import { PatternsGraphContent } from '@/components/patterns/PatternsGraphContent';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';

export type PatternsBodyProps = {
  computation: PatternsComputation | null;
  isGraphMode: boolean;
  mrsLatest: MrsIiAssessmentSubmission | null;
  pamLatest: Pam13AssessmentSubmission | null;
};

export const PatternsBody = ({
  computation,
  isGraphMode,
  mrsLatest,
  pamLatest,
}: PatternsBodyProps) => {
  const { t } = useTranslate();

  if (!computation) {
    return (
      <Box flex={1} align="center" justify="center" padding="lg">
        <Text size="sm" color="foreground-muted" align="center">
          {t('patterns_loading_fallback')}
        </Text>
      </Box>
    );
  }

  if (isGraphMode) {
    return <PatternsGraphContent computation={computation} />;
  }

  return (
    <PatternsCardsContent
      computation={computation}
      mrsLatest={mrsLatest}
      pamLatest={pamLatest}
    />
  );
};
