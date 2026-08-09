import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { DASHBOARD_SURFACE } from '@/lib/dashboard/surfaces';
import { cn } from '@/lib/ui';

export const CycleInsightsLegend = () => {
  const { t } = useTranslate();

  const items = [
    {
      key: 'period',
      label: t('cycle_insights_legend_period'),
      swatch: 'bg-primary-500',
    },
    {
      key: 'fertile',
      label: t('cycle_insights_legend_fertile'),
      swatch: 'bg-sage-mist',
    },
    {
      key: 'ovulation',
      label: t('cycle_insights_legend_ovulation'),
      swatch: 'bg-lavender',
    },
    {
      key: 'predicted',
      label: t('cycle_insights_legend_predicted_period'),
      swatch: 'bg-dusty-rose',
    },
  ] as const;

  return (
    <Box
      direction="row"
      className={cn(DASHBOARD_SURFACE.nestedLift, 'flex-wrap gap-x-3 gap-y-2 px-3 py-2.5')}>
      {items.map((item) => (
        <Box key={item.key} direction="row" align="center" className="gap-1.5">
          <Box className={cn('h-2.5 w-2.5 rounded-full', item.swatch)} />
          <Text size="2xs" color="foreground">
            {item.label}
          </Text>
        </Box>
      ))}
    </Box>
  );
};
