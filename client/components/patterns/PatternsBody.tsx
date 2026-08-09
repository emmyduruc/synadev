import type {
  MrsIiAssessmentSubmission,
  Pam13AssessmentSubmission,
} from '@syna/shared-types';
import type { PatternsComputation } from '@syna/shared-utils';

import { PatternsCardsContent } from '@/components/patterns/PatternsCardsContent';
import {
  PatternsGraphContent,
  type PatternsChartWindow,
} from '@/components/patterns/PatternsGraphContent';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import type { PatternChartSeries } from '@/lib/patterns/buildPatternChartSeries';

export type PatternsBodyProps = {
  computation: PatternsComputation | null;
  chartSeries: readonly PatternChartSeries[];
  chartWindow: PatternsChartWindow;
  isGraphMode: boolean;
  mrsLatest: MrsIiAssessmentSubmission | null;
  pamLatest: Pam13AssessmentSubmission | null;
  onExitGraphMode: () => void;
  onExportPdf: () => void;
  isExporting: boolean;
};

export const PatternsBody = ({
  computation,
  chartSeries,
  chartWindow,
  isGraphMode,
  mrsLatest,
  pamLatest,
  onExitGraphMode,
  onExportPdf,
  isExporting,
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
    return (
      <PatternsGraphContent
        chartSeries={chartSeries}
        chartWindow={chartWindow}
        onExitGraphMode={onExitGraphMode}
        onExportPdf={onExportPdf}
        isExporting={isExporting}
      />
    );
  }

  return (
    <PatternsCardsContent
      computation={computation}
      mrsLatest={mrsLatest}
      pamLatest={pamLatest}
    />
  );
};
