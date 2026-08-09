import { type CycleDayMarker } from '@syna/shared-utils';

import { CycleDayMarkerBadge } from '@/components/cycle/CycleDayMarkerBadge';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { CALENDAR_WEEKDAY_HEADER_KEYS } from '@/lib/dashboard/calendarUtils';
import { cn } from '@/lib/ui';

export type CycleInsightsWeekDay = {
  dateKey: string;
  dayNumber: number;
  weekdayIndex: number;
  isToday: boolean;
  primaryMarker: CycleDayMarker | null;
};

export type CycleInsightsWeekStripProps = {
  days: readonly CycleInsightsWeekDay[];
};

const dayRingClass = (
  marker: CycleDayMarker | null,
  isToday: boolean,
): string => {
  if (marker === 'period') {
    return 'border-primary-500 bg-primary-500/15';
  }

  if (marker === 'predicted_period') {
    return 'border-dusty-rose bg-dusty-rose-light';
  }

  if (marker === 'ovulation') {
    return 'border-lavender bg-lavender-light';
  }

  if (marker === 'fertile') {
    return 'border-sage-mist bg-sage-mist-light';
  }

  if (isToday) {
    return 'border-primary-400 bg-primary-50';
  }

  return 'border-foreground-muted/25 bg-card';
};

export const CycleInsightsWeekStrip = ({ days }: CycleInsightsWeekStripProps) => {
  const { t } = useTranslate();

  return (
    <Box className="rounded-3xl border border-white bg-card/90 px-3 py-3 shadow-sm">
      <Box direction="row" justify="between">
        {days.map((day) => {
          const weekdayKey = CALENDAR_WEEKDAY_HEADER_KEYS[day.weekdayIndex];

          return (
            <Box key={day.dateKey} align="center" className="min-w-[40px]">
              <Text size="2xs" color="foreground-muted" responsive={false}>
                {t(weekdayKey)}
              </Text>
              <Box
                align="center"
                justify="center"
                className={cn(
                  'mt-1.5 h-9 w-9 rounded-full border-2',
                  dayRingClass(day.primaryMarker, day.isToday),
                  day.isToday && 'border-dashed',
                )}>
                <Text
                  size="sm"
                  weight={day.isToday ? 'bold' : 'medium'}
                  responsive={false}
                  color={day.primaryMarker === 'period' ? 'primary' : 'foreground'}>
                  {day.dayNumber}
                </Text>
              </Box>
              <Box className="mt-1.5 h-3.5 items-center justify-center">
                <CycleDayMarkerBadge marker={day.primaryMarker} size="sm" />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
