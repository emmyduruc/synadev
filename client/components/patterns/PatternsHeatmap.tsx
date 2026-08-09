import type { PatternHeatmapResult } from '@syna/shared-utils';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { DASHBOARD_SURFACE } from '@/lib/dashboard/surfaces';
import { cn } from '@/lib/ui';

export type PatternsHeatmapProps = {
  heatmap: PatternHeatmapResult;
};

export const PatternsHeatmap = ({ heatmap }: PatternsHeatmapProps) => {
  const { t } = useTranslate();
  const visibleDates = heatmap.dateKeys.slice(-14);

  if (!heatmap.hasPeriodData || heatmap.isEmpty) {
    return (
      <Box className={cn(DASHBOARD_SURFACE.sageCard, 'gap-2 p-4')}>
        <Text size="sm" weight="bold">
          {t('patterns_heatmap_title')}
        </Text>
        <Text size="xs" color="foreground" className="leading-snug">
          {t('patterns_heatmap_empty')}
        </Text>
      </Box>
    );
  }

  return (
    <Box className={cn(DASHBOARD_SURFACE.sageCard, 'gap-3 p-4')}>
      <Text size="sm" weight="bold">
        {t('patterns_heatmap_title')}
      </Text>
      <Box gap="xs">
        {heatmap.rows.slice(0, 6).map((row) => (
          <Box key={row.symptomId} direction="row" align="center" gap="sm">
            <Text size="2xs" className="w-20" numberOfLines={1}>
              {t(`symptom_${row.symptomId}`)}
            </Text>
            <Box direction="row" className="flex-1 flex-wrap gap-0.5">
              {visibleDates.map((dateKey) => {
                const cell = row.cells.find((item) => item.dateKey === dateKey);
                const logged = cell?.logged ?? false;

                return (
                  <Box
                    key={`${row.symptomId}-${dateKey}`}
                    className={cn(
                      'h-2.5 w-2.5 rounded-sm',
                      logged ? 'bg-primary-500' : 'bg-card/70',
                    )}
                  />
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>
      <Text size="2xs" color="foreground-muted">
        {t('patterns_disclaimer')}
      </Text>
    </Box>
  );
};
