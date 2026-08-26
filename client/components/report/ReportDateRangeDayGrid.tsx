import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import {
  buildMonthGrid,
  CALENDAR_WEEKDAY_HEADER_KEYS,
} from '@/lib/dashboard/calendarUtils';
import { toDateKey } from '@/lib/date/dateKeys';
import type { ReportDateRange, ReportDateRangeBounds } from '@/lib/report/reportDateRange';
import { cn } from '@/lib/ui';

export type ReportDateRangeDayGridProps = {
  year: number;
  monthIndex: number;
  draftRange: Partial<ReportDateRange>;
  bounds: ReportDateRangeBounds;
  onSelectDate: (dateKey: string) => void;
};

const DAY_TONE = {
  start: 'start',
  end: 'end',
  inRange: 'inRange',
  today: 'today',
  muted: 'muted',
  default: 'default',
} as const;

type DayTone = (typeof DAY_TONE)[keyof typeof DAY_TONE];

type DayToneStyles = {
  circleClass: string;
  textClass: string;
  isBold: boolean;
};

const DAY_TONE_STYLES: Record<DayTone, DayToneStyles> = {
  [DAY_TONE.start]: {
    circleClass: 'bg-primary-500',
    textClass: 'text-white',
    isBold: true,
  },
  [DAY_TONE.end]: {
    circleClass: 'bg-primary-500',
    textClass: 'text-white',
    isBold: true,
  },
  [DAY_TONE.inRange]: {
    circleClass: 'bg-primary-100',
    textClass: 'text-primary',
    isBold: false,
  },
  [DAY_TONE.today]: {
    circleClass: 'bg-primary-500/15',
    textClass: 'text-primary',
    isBold: true,
  },
  [DAY_TONE.muted]: {
    circleClass: 'bg-transparent',
    textClass: 'text-black/30',
    isBold: false,
  },
  [DAY_TONE.default]: {
    circleClass: 'bg-transparent',
    textClass: 'text-black',
    isBold: false,
  },
};

const resolveDayTone = (
  dateKey: string,
  isCurrentMonth: boolean,
  isSelectable: boolean,
  isToday: boolean,
  draftRange: Partial<ReportDateRange>,
): DayTone => {
  const { fromDateKey, toDateKey } = draftRange;

  if (fromDateKey === dateKey) {
    return DAY_TONE.start;
  }

  if (toDateKey === dateKey) {
    return DAY_TONE.end;
  }

  if (
    fromDateKey &&
    toDateKey &&
    dateKey > fromDateKey &&
    dateKey < toDateKey
  ) {
    return DAY_TONE.inRange;
  }

  if (!isCurrentMonth || !isSelectable) {
    return DAY_TONE.muted;
  }

  if (isToday) {
    return DAY_TONE.today;
  }

  return DAY_TONE.default;
};

export const ReportDateRangeDayGrid = ({
  year,
  monthIndex,
  draftRange,
  bounds,
  onSelectDate,
}: ReportDateRangeDayGridProps) => {
  const { t } = useTranslate();
  const weeks = buildMonthGrid(year, monthIndex);

  return (
    <Box gap="sm">
      <Box direction="row" justify="between" className="px-1">
        {CALENDAR_WEEKDAY_HEADER_KEYS.map((weekdayKey) => (
          <Box key={weekdayKey} className="w-[13%]">
            <Text size="2xs" align="center" className="text-black/50" responsive={false}>
              {t(weekdayKey)}
            </Text>
          </Box>
        ))}
      </Box>

      {weeks.map((week, weekIndex) => (
        <Box
          key={`${year}-${monthIndex}-week-${weekIndex}`}
          direction="row"
          justify="between"
          className="px-1">
          {week.map((day) => {
            const dateKey = toDateKey(day.date);
            const isSelectable =
              day.isCurrentMonth &&
              dateKey >= bounds.minDateKey &&
              dateKey <= bounds.maxDateKey;
            const tone = resolveDayTone(
              dateKey,
              day.isCurrentMonth,
              isSelectable,
              day.isToday,
              draftRange,
            );
            const { circleClass, textClass, isBold } = DAY_TONE_STYLES[tone];

            return (
              <Box key={dateKey} align="center" className="w-[13%] py-0.5">
                <TouchableOpacity
                  accessibilityRole="button"
                  disabled={!isSelectable}
                  onPress={() => onSelectDate(dateKey)}
                  className={cn(
                    'h-10 w-10 items-center justify-center rounded-full',
                    circleClass,
                  )}>
                  <Text
                    size="sm"
                    weight={isBold ? 'bold' : 'medium'}
                    className={textClass}
                    responsive={false}>
                    {day.dayNumber}
                  </Text>
                </TouchableOpacity>
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};
