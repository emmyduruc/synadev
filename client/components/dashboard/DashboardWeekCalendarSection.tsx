import { type CycleDayMarker } from '@syna/shared-utils';

import { CycleDayMarkerBadge } from '@/components/cycle/CycleDayMarkerBadge';
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
import { toDateKey } from '@/lib/date/dateKeys';
import { cn, semanticColors } from '@/lib/ui';

export type DashboardWeekCalendarSectionProps = {
  onOpenCalendar: () => void;
  embedded?: boolean;
  getPrimaryMarker?: (dateKey: string) => CycleDayMarker | null;
};

export const DashboardWeekCalendarSection = ({
  onOpenCalendar,
  embedded = false,
  getPrimaryMarker,
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
          const dateKey = toDateKey(day.date);
          const marker = getPrimaryMarker?.(dateKey) ?? null;

          return (
            <Box key={dateKey} align="center" className="min-w-[36px]">
              <Text
                size="xs"
                color="foreground"
                responsive={false}
                className={day.isToday ? undefined : 'opacity-70'}
              >
                {t(weekdayKey)}
              </Text>
              <Box
                align="center"
                justify="center"
                className={cn(
                  'mt-1 h-9 w-9 rounded-full',
                  day.isToday ? 'bg-primary-500' : undefined,
                )}
              >
                <Text
                  size="sm"
                  weight={day.isToday ? 'semibold' : 'medium'}
                  responsive={false}
                  className={day.isToday ? 'text-white' : undefined}
                >
                  {day.date.getDate()}
                </Text>
              </Box>
              <Box className="mt-1.5 h-3.5 items-center justify-center">
                {marker ? (
                  <CycleDayMarkerBadge marker={marker} size="sm" />
                ) : null}
                {!marker && !day.isToday ? (
                  <Box className="h-2 w-2 rounded-full border border-foreground-muted bg-card" />
                ) : null}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
