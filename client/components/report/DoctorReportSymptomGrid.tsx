import type { PatternHeatmapResult } from '@syna/shared-utils';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { cn } from '@/lib/ui';

export type DoctorReportSymptomGridProps = {
  heatmap: PatternHeatmapResult;
};

export const DoctorReportSymptomGrid = ({ heatmap }: DoctorReportSymptomGridProps) => {
  const { t } = useTranslate();
  const visibleDates = heatmap.dateKeys.slice(-14);

  if (!heatmap.hasPeriodData || heatmap.isEmpty) {
    return (
      <Box className="rounded-xl border border-border bg-card/80 p-3">
        <Text size="2xs" weight="semibold" className="mb-2 text-primary">
          {t('doctor_report_symptom_grid_title')}
        </Text>
        <Text size="xs" className="text-black/70">
          {t('doctor_report_symptom_grid_empty')}
        </Text>
      </Box>
    );
  }

  return (
    <Box className="rounded-xl border border-border bg-card/80 p-3">
      <Text size="2xs" weight="semibold" className="mb-3 text-primary">
        {t('doctor_report_symptom_grid_title')}
      </Text>
      <Box gap="xs">
        {heatmap.rows.slice(0, 6).map((row) => (
          <Box key={row.symptomId} direction="row" align="center" gap="sm">
            <Text size="2xs" className="w-20 text-black" numberOfLines={1}>
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
                      logged ? 'bg-primary-500' : 'bg-muted/60',
                    )}
                  />
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
