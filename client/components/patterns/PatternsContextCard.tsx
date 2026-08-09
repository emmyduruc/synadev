import type { PatternContextResult } from '@syna/shared-utils';
import { PATTERN_STATUS } from '@syna/shared-utils';

import { PatternsSparkline } from '@/components/patterns/PatternsSparkline';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { DASHBOARD_SURFACE } from '@/lib/dashboard/surfaces';
import { cn, semanticColors } from '@/lib/ui';

export type PatternsContextCardProps = {
  context: PatternContextResult;
  onLearnMore: () => void;
};

const statusLabelKey = (status: PatternContextResult['status']) => {
  if (status === PATTERN_STATUS.recognized) {
    return 'patterns_status_recognized';
  }

  if (status === PATTERN_STATUS.emerging) {
    return 'patterns_status_emerging';
  }

  if (status === PATTERN_STATUS.locked) {
    return 'patterns_status_locked';
  }

  return 'patterns_status_needs_more_data';
};

export const PatternsContextCard = ({
  context,
  onLearnMore,
}: PatternsContextCardProps) => {
  const { t } = useTranslate();

  return (
    <Box className={cn(DASHBOARD_SURFACE.lavenderShell, 'gap-2 p-4')}>
      <Box direction="row" align="center" justify="between" gap="sm">
        <Text size="sm" weight="bold" className="flex-1">
          {t(context.titleKey)}
        </Text>
        <Box className="rounded-full bg-card/90 px-2 py-1">
          <Text size="2xs" weight="semibold" color="primary">
            {t(statusLabelKey(context.status))}
          </Text>
        </Box>
      </Box>

      <Text size="xs" color="foreground" className="leading-snug">
        {t(context.summaryKey)}
      </Text>

      {context.status !== PATTERN_STATUS.locked ? (
        <Box direction="row" align="center" justify="between" className="mt-1">
          <PatternsSparkline
            points={context.sparklineA}
            color={semanticColors.ovum.lavender}
          />
          <PatternsSparkline
            points={context.sparklineB}
            color={semanticColors.splashBackground}
          />
        </Box>
      ) : null}

      {context.status === PATTERN_STATUS.recognized && context.overallContextCount > 0 ? (
        <Text size="2xs" color="foreground-muted">
          {t('patterns_part_of_contexts', { count: context.overallContextCount })}
        </Text>
      ) : null}

      <TouchableOpacity accessibilityRole="button" onPress={onLearnMore}>
        <Text size="2xs" weight="semibold" color="primary">
          {t('patterns_learn_more')}
        </Text>
      </TouchableOpacity>

      <Text size="2xs" color="foreground-muted">
        {t('patterns_disclaimer')}
      </Text>
    </Box>
  );
};
