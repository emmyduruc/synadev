import { Box } from '@/components/ui/Box';
import { CalendarIcon } from '@/components/ui/icons/CalendarIcon';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import {
  CALENDAR_WEEKDAY_HEADER_KEYS,
  getCurrentWeekDays,
} from '@/lib/dashboard/calendarUtils';
import { DASHBOARD_ICON_WELL, DASHBOARD_SURFACE } from '@/lib/dashboard/surfaces';
import { cn, semanticColors } from '@/lib/ui';

export type DashboardWeekCalendarSectionProps = {
  onOpenCalendar: () => void;
  embedded?: boolean;
};

export const DashboardWeekCalendarSection = ({
  onOpenCalendar,
  embedded = false,
}: DashboardWeekCalendarSectionProps) => {
  const { t } = useTranslate();
  const weekDays = getCurrentWeekDays();

  return (
    <Box className={embedded ? undefined : cn(DASHBOARD_SURFACE.lavenderShell, 'p-4')}>
      <Box direction="row" align="center" justify="between" className={embedded ? 'mb-3' : 'mb-4'}>
        <Text size="sm" weight="semibold">
          {t('dashboard_week_calendar_title')}
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={t('dashboard_open_calendar_accessibility_label')}
          onPress={onOpenCalendar}
          className={cn('h-10 w-10', DASHBOARD_ICON_WELL.calendar)}>
          <CalendarIcon size={20} color={semanticColors.dashboardIcon.calendar} />
        </TouchableOpacity>
      </Box>

      <Box direction="row" justify="between" className="px-1">
        {weekDays.map((day, index) => {
          const weekdayKey = CALENDAR_WEEKDAY_HEADER_KEYS[index];

          return (
            <Box key={day.dayKey} align="center" className="min-w-[36px]">
              <Text size="2xs" color="foreground-muted" responsive={false}>
                {t(weekdayKey)}
              </Text>
              <Text
                size="sm"
                weight={day.isToday ? 'bold' : 'medium'}
                responsive={false}
                className="mt-1">
                {day.date.getDate()}
              </Text>
              <Box
                className={cn(
                  'mt-2 h-2 w-2 rounded-full',
                  day.isToday ? 'bg-primary-500' : 'border border-foreground-muted bg-card',
                )}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
