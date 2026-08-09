import type {
  MrsIiAssessmentSubmission,
  Pam13AssessmentSubmission,
} from '@syna/shared-types';
import type { PatternContextResult, PatternsComputation } from '@syna/shared-utils';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import { PatternsAxisCard } from '@/components/patterns/PatternsAxisCard';
import { PatternsClinicalStrip } from '@/components/patterns/PatternsClinicalStrip';
import { PatternsContextCard } from '@/components/patterns/PatternsContextCard';
import { PatternsHeatmap } from '@/components/patterns/PatternsHeatmap';
import { PatternsLearnMoreSheet } from '@/components/patterns/PatternsLearnMoreSheet';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';

export type PatternsCardsContentProps = {
  computation: PatternsComputation;
  mrsLatest: MrsIiAssessmentSubmission | null;
  pamLatest: Pam13AssessmentSubmission | null;
};

export const PatternsCardsContent = ({
  computation,
  mrsLatest,
  pamLatest,
}: PatternsCardsContentProps) => {
  const { t } = useTranslate();
  const [activeContext, setActiveContext] = useState<PatternContextResult | null>(null);

  return (
    <>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, gap: 16 }}>
        <PatternsClinicalStrip mrsLatest={mrsLatest} pamLatest={pamLatest} />

        <Box gap="sm">
          <Text size="sm" weight="bold">
            {t('patterns_axes_section_title')}
          </Text>
          {computation.axes.map((axis) => (
            <PatternsAxisCard key={axis.id} axis={axis} />
          ))}
        </Box>

        <Box gap="sm">
          <Text size="sm" weight="bold">
            {t('patterns_contexts_section_title')}
          </Text>
          {computation.contexts.map((context) => (
            <PatternsContextCard
              key={context.id}
              context={context}
              onLearnMore={() => {
                setActiveContext(context);
              }}
            />
          ))}
        </Box>

        <PatternsHeatmap heatmap={computation.heatmap} />

        <Text size="2xs" color="foreground-muted" align="center" className="leading-snug">
          {t('patterns_footer_note')}
        </Text>
      </ScrollView>

      <PatternsLearnMoreSheet
        context={activeContext}
        visible={activeContext !== null}
        onClose={() => {
          setActiveContext(null);
        }}
      />
    </>
  );
};
