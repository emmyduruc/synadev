import { CYCLE_DAY_MARKER, type CycleDayMarker } from '@syna/shared-utils';
import type { RefObject } from 'react';
import { View } from 'react-native';

import { CycleDayMarkerBadge } from '@/components/cycle/CycleDayMarkerBadge';
import { Box } from '@/components/ui/Box';
import { CheckIcon } from '@/components/ui/icons/CheckIcon';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import type { CalendarMonth } from '@/lib/dashboard/calendarUtils';
import { CALENDAR_WEEKDAY_HEADER_KEYS } from '@/lib/dashboard/calendarUtils';
import { toDateKey } from '@/lib/period/periodStorage';
import { cn } from '@/lib/ui';

export type CalendarMonthViewProps = {
  months: CalendarMonth[];
  selectedDateKeys?: ReadonlySet<string>;
  markerByDateKey?: ReadonlyMap<string, CycleDayMarker | null>;
  onToggleDate?: (dateKey: string) => void;
  scrollTargetMonthIndex?: number;
  scrollTargetRef?: RefObject<View | null>;
  onScrollTargetReady?: () => void;
};

const circleClassForMarker = (
  isSelected: boolean,
  isToday: boolean,
  marker: CycleDayMarker | null,
): string => {
  if (isSelected) {
    return 'bg-primary-500';
  }

  if (marker === CYCLE_DAY_MARKER.period) {
    return 'border-2 border-primary-500 bg-primary-500/15';
  }

  if (marker === CYCLE_DAY_MARKER.predictedPeriod) {
    return 'border-2 border-dusty-rose bg-dusty-rose-light';
  }

  if (marker === CYCLE_DAY_MARKER.ovulation) {
    return 'border-2 border-lavender bg-lavender-light';
  }

  if (marker === CYCLE_DAY_MARKER.fertile) {
    return 'border-2 border-sage-mist bg-sage-mist-light';
  }

  if (isToday) {
    return 'bg-primary-500/15';
  }

  return 'border border-foreground-muted/30';
};

export const CalendarMonthView = ({
  months,
  selectedDateKeys,
  markerByDateKey,
  onToggleDate,
  scrollTargetMonthIndex,
  scrollTargetRef,
  onScrollTargetReady,
}: CalendarMonthViewProps) => {
  const { t } = useTranslate();
  const isSelectable = Boolean(onToggleDate);

  return (
    <Box gap="lg">
      {months.map((month) => {
        const isScrollTarget = month.monthIndex === scrollTargetMonthIndex;
        const monthHeader = (
          <Text size="xl" weight="bold" align="center">
            {t(month.labelKey)}
          </Text>
        );
        const monthWeekdayHeader = (
          <Box direction="row" justify="between" className="px-1">
            {CALENDAR_WEEKDAY_HEADER_KEYS.map((weekdayKey) => (
              <Box key={`${month.monthIndex}-${weekdayKey}`} className="w-[13%]">
                <Text size="2xs" color="foreground-muted" align="center" responsive={false}>
                  {t(weekdayKey)}
                </Text>
              </Box>
            ))}
          </Box>
        );
        const monthWeeks = month.weeks.map((week, weekIndex) => (
          <Box
            key={`${month.year}-${month.monthIndex}-week-${weekIndex}`}
            direction="row"
            justify="between"
            className="px-1">
            {week.map((day) => {
              const dateKey = toDateKey(day.date);
              const isSelected = selectedDateKeys?.has(dateKey) ?? false;
              const marker = markerByDateKey?.get(dateKey) ?? null;

              const dayCircle = (
                <Box align="center">
                  <Box
                    align="center"
                    justify="center"
                    className={cn(
                      'mt-1 h-9 w-9 rounded-full',
                      circleClassForMarker(isSelected, day.isToday, marker),
                      !day.isCurrentMonth && 'opacity-35',
                    )}>
                    {isSelected ? (
                      <CheckIcon size={16} />
                    ) : (
                      <Text
                        size="sm"
                        weight={day.isToday ? 'bold' : 'medium'}
                        color={day.isToday ? 'primary' : 'foreground'}
                        responsive={false}>
                        {day.dayNumber}
                      </Text>
                    )}
                  </Box>
                  {!isSelectable ? (
                    <Box className="mt-0.5 h-3 items-center justify-center">
                      <CycleDayMarkerBadge marker={marker} size="sm" />
                    </Box>
                  ) : null}
                </Box>
              );

              return (
                <Box key={dateKey} align="center" className="w-[13%] py-1">
                  {day.isToday ? (
                    <Text size="2xs" color="primary" weight="semibold" responsive={false}>
                      {t('calendar_today_label')}
                    </Text>
                  ) : (
                    <Box className="h-3" />
                  )}
                  {isSelectable ? (
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      onPress={() => onToggleDate?.(dateKey)}>
                      {dayCircle}
                    </TouchableOpacity>
                  ) : (
                    dayCircle
                  )}
                </Box>
              );
            })}
          </Box>
        ));

        return (
          <View
            key={`${month.year}-${month.monthIndex}`}
            ref={isScrollTarget ? scrollTargetRef : undefined}
            onLayout={isScrollTarget ? () => onScrollTargetReady?.() : undefined}
            className="gap-4">
            {monthHeader}
            {monthWeekdayHeader}
            {monthWeeks}
          </View>
        );
      })}
    </Box>
  );
};
