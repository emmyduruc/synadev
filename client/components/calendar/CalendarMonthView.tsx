import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import type { CalendarMonth } from '@/lib/dashboard/calendarUtils';
import { CALENDAR_WEEKDAY_HEADER_KEYS } from '@/lib/dashboard/calendarUtils';
import { cn } from '@/lib/ui';

export type CalendarMonthViewProps = {
  months: CalendarMonth[];
};

export const CalendarMonthView = ({ months }: CalendarMonthViewProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="lg">
      {months.map((month) => (
        <Box key={`${month.year}-${month.monthIndex}`} gap="sm">
          <Text size="xl" weight="bold" align="center">
            {t(month.labelKey)}
          </Text>

          <Box direction="row" justify="between" className="px-1">
            {CALENDAR_WEEKDAY_HEADER_KEYS.map((weekdayKey) => (
              <Box key={`${month.monthIndex}-${weekdayKey}`} className="w-[13%]">
                <Text size="2xs" color="foreground-muted" align="center" responsive={false}>
                  {t(weekdayKey)}
                </Text>
              </Box>
            ))}
          </Box>

          {month.weeks.map((week, weekIndex) => (
            <Box
              key={`${month.year}-${month.monthIndex}-week-${weekIndex}`}
              direction="row"
              justify="between"
              className="px-1">
              {week.map((day) => (
                <Box key={day.date.toISOString()} align="center" className="w-[13%] py-1">
                  {day.isToday ? (
                    <Text size="2xs" color="primary" weight="semibold" responsive={false}>
                      {t('calendar_today_label')}
                    </Text>
                  ) : (
                    <Box className="h-3" />
                  )}
                  <Box
                    align="center"
                    justify="center"
                    className={cn(
                      'mt-1 h-9 w-9 rounded-full',
                      day.isToday && 'bg-primary-500/15',
                      !day.isCurrentMonth && 'opacity-35',
                    )}>
                    <Text
                      size="sm"
                      weight={day.isToday ? 'bold' : 'medium'}
                      color={day.isToday ? 'primary' : 'foreground'}
                      responsive={false}>
                      {day.dayNumber}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};
