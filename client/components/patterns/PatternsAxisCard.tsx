import type { PatternAxisResult } from '@syna/shared-utils';
import { PATTERN_STATUS } from '@syna/shared-utils';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { DASHBOARD_SURFACE } from '@/lib/dashboard/surfaces';
import { cn } from '@/lib/ui';

export type PatternsAxisCardProps = {
  axis: PatternAxisResult;
};

export const PatternsAxisCard = ({ axis }: PatternsAxisCardProps) => {
  const { t } = useTranslate();
  const recognized = axis.status === PATTERN_STATUS.recognized;

  return (
    <Box className={cn(DASHBOARD_SURFACE.blushCard, 'gap-1.5 p-3')}>
      <Text size="2xs" weight="semibold" color="primary">
        {recognized
          ? t('patterns_connection_recognized')
          : t('patterns_status_needs_more_data')}
      </Text>
      <Text size="sm" weight="bold">
        {t(axis.titleKey)}
      </Text>
      <Text size="xs" color="foreground" className="leading-snug">
        {t(axis.summaryKey)}
      </Text>
    </Box>
  );
};
