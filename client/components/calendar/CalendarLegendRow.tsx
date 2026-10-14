import { CycleDayMarkerBadge } from '@/components/cycle/CycleDayMarkerBadge';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import type { CalendarLegendItemConfig } from '@/lib/calendar/calendarMarkerVisuals';
import { cn } from '@/lib/ui';

export type CalendarLegendRowProps = {
  item: CalendarLegendItemConfig;
};

export const CalendarLegendRow = ({ item }: CalendarLegendRowProps) => {
  const { t } = useTranslate();

  return (
    <Box direction="row" align="center" className="gap-3">
      <Box align="center" className="w-11">
        <Box
          align="center"
          justify="center"
          className={cn('h-9 w-9 rounded-full', item.circleClass)}>
          <Text
            size="sm"
            weight={item.isToday ? 'bold' : 'medium'}
            color={item.isToday ? 'primary' : 'foreground'}
            responsive={false}>
            {item.isToday ? t('calendar_legend_sample_day_today') : t('calendar_legend_sample_day')}
          </Text>
        </Box>
        <Box className="mt-0.5 h-3 items-center justify-center">
          {item.marker ? <CycleDayMarkerBadge marker={item.marker} size="sm" /> : null}
        </Box>
      </Box>

      <Box flex={1} className="gap-0.5">
        <Text size="sm" weight="semibold">
          {t(item.labelKey)}
        </Text>
        <Text size="xs" color="foreground-muted" className="leading-relaxed">
          {t(item.descriptionKey)}
        </Text>
      </Box>
    </Box>
  );
};
