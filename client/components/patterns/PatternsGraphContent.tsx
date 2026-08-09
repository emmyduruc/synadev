import type { PatternsComputation } from '@syna/shared-utils';
import { PATTERN_STATUS } from '@syna/shared-utils';
import { ScrollView } from 'react-native';

import { PatternsHeatmap } from '@/components/patterns/PatternsHeatmap';
import { PatternsSparkline } from '@/components/patterns/PatternsSparkline';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { DASHBOARD_SURFACE } from '@/lib/dashboard/surfaces';
import { cn, semanticColors } from '@/lib/ui';

export type PatternsGraphContentProps = {
  computation: PatternsComputation;
};

export const PatternsGraphContent = ({ computation }: PatternsGraphContentProps) => {
  const { t } = useTranslate();

  return (
    <ScrollView
      className="flex-1"
      horizontal={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, gap: 16 }}>
      <Text size="sm" weight="semibold" color="foreground-muted">
        {t('patterns_graph_mode_hint')}
      </Text>

      {computation.contexts
        .filter((context) => context.status !== PATTERN_STATUS.locked)
        .map((context) => (
          <Box key={context.id} className={cn(DASHBOARD_SURFACE.lavenderShell, 'gap-3 p-4')}>
            <Text size="sm" weight="bold">
              {t(context.titleKey)}
            </Text>
            <Box direction="row" justify="around" className="py-2">
              <PatternsSparkline
                points={context.sparklineA}
                width={150}
                height={64}
                color={semanticColors.ovum.lavender}
              />
              <PatternsSparkline
                points={context.sparklineB}
                width={150}
                height={64}
                color={semanticColors.splashBackground}
              />
            </Box>
            <Text size="2xs" color="foreground-muted">
              {t('patterns_disclaimer')}
            </Text>
          </Box>
        ))}

      <PatternsHeatmap heatmap={computation.heatmap} />
    </ScrollView>
  );
};
