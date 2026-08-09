import { CycleInsightsStatTile } from '@/components/cycle/CycleInsightsStatTile';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';

export type CycleInsightsStatsRowProps = {
  cycleLengthDays: number;
  periodLengthDays: number;
  ovulationDay: number | null;
  hasPeriodData: boolean;
};

export const CycleInsightsStatsRow = ({
  cycleLengthDays,
  periodLengthDays,
  ovulationDay,
  hasPeriodData,
}: CycleInsightsStatsRowProps) => {
  const { t } = useTranslate();

  if (!hasPeriodData) {
    return null;
  }

  const ovulationValue =
    ovulationDay !== null
      ? t('cycle_insights_stat_ovulation_value', { day: ovulationDay })
      : t('cycle_insights_stat_unavailable');

  return (
    <Box gap="sm">
      <Text size="2xs" weight="semibold" color="foreground-muted">
        {t('cycle_insights_stats_label')}
      </Text>
      <Box direction="row" gap="sm">
        <CycleInsightsStatTile
          label={t('cycle_insights_stat_cycle_length')}
          value={t('cycle_insights_stat_days_value', { days: cycleLengthDays })}
        />
        <CycleInsightsStatTile
          label={t('cycle_insights_stat_period_length')}
          value={t('cycle_insights_stat_days_value', { days: periodLengthDays })}
        />
        <CycleInsightsStatTile
          label={t('cycle_insights_stat_ovulation')}
          value={ovulationValue}
        />
      </Box>
    </Box>
  );
};
