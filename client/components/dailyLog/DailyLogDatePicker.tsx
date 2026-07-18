import { useMemo } from 'react';

import { DailyLogDateWheel } from './DailyLogDateWheel';

import { Box } from '@/components/ui/Box';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '@/components/ui/icons/ChevronRightIcon';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { DASHBOARD_ICON_WELL } from '@/lib/dashboard/surfaces';
import { addDaysToKey, buildRecentDays, fromDateKey, isTodayKey, toDateKey } from '@/lib/date/dateKeys';
import { cn, semanticColors } from '@/lib/ui';

const RECENT_DAYS_COUNT = 180;

export type DailyLogDatePickerProps = {
  selectedDateKey: string;
  onChangeDate: (dateKey: string) => void;
};

/**
 * Shared single-select date control (label + chevrons + horizontal day strip)
 * used by symptoms, mood, and record-period.
 */
export const DailyLogDatePicker = ({
  selectedDateKey,
  onChangeDate,
}: DailyLogDatePickerProps) => {
  const { t } = useTranslate();
  const days = useMemo(() => buildRecentDays(RECENT_DAYS_COUNT), []);
  const earliestKey = days[0]?.dateKey;
  const isToday = isTodayKey(selectedDateKey);
  const isEarliest = selectedDateKey === earliestKey;
  const yesterdayKey = addDaysToKey(toDateKey(new Date()), -1);

  const dateLabel = useMemo(() => {
    if (isToday) {
      return t('daily_log_today');
    }

    if (selectedDateKey === yesterdayKey) {
      return t('daily_log_yesterday');
    }

    return fromDateKey(selectedDateKey).toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }, [isToday, selectedDateKey, t, yesterdayKey]);

  return (
    <Box gap="sm">
      <Box direction="row" align="center" justify="between">
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={t('daily_log_previous_day_label')}
          disabled={isEarliest}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          onPress={() => onChangeDate(addDaysToKey(selectedDateKey, -1))}
          className={cn('h-10 w-10', DASHBOARD_ICON_WELL.gem, isEarliest && 'opacity-40')}>
          <ChevronLeftIcon size={20} color={semanticColors.foreground} />
        </TouchableOpacity>

        <Text size="base" weight="semibold">
          {dateLabel}
        </Text>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={t('daily_log_next_day_label')}
          disabled={isToday}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          onPress={() => onChangeDate(addDaysToKey(selectedDateKey, 1))}
          className={cn('h-10 w-10', DASHBOARD_ICON_WELL.gem, isToday && 'opacity-40')}>
          <ChevronRightIcon size={20} color={semanticColors.foreground} />
        </TouchableOpacity>
      </Box>

      <DailyLogDateWheel days={days} selectedDateKey={selectedDateKey} onSelect={onChangeDate} />
    </Box>
  );
};
