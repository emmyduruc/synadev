import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { CALENDAR_VIEW, type CalendarView } from '@/lib/dashboard/calendarUtils';
import { cn } from '@/lib/ui';

export type CalendarViewToggleProps = {
  activeView: CalendarView;
  onChange: (view: CalendarView) => void;
  monthLabel: string;
  yearLabel: string;
};

export const CalendarViewToggle = ({
  activeView,
  onChange,
  monthLabel,
  yearLabel,
}: CalendarViewToggleProps) => (
  <Box direction="row" className="rounded-full bg-muted p-1">
    <TouchableOpacity
      accessibilityRole="button"
      onPress={() => onChange(CALENDAR_VIEW.month)}
      className={cn(
        'flex-1 items-center rounded-full px-4 py-2',
        activeView === CALENDAR_VIEW.month && 'bg-white',
      )}>
      <Text
        size="sm"
        weight={activeView === CALENDAR_VIEW.month ? 'semibold' : 'medium'}
        align="center">
        {monthLabel}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      accessibilityRole="button"
      onPress={() => onChange(CALENDAR_VIEW.year)}
      className={cn(
        'flex-1 items-center rounded-full px-4 py-2',
        activeView === CALENDAR_VIEW.year && 'bg-white',
      )}>
      <Text
        size="sm"
        weight={activeView === CALENDAR_VIEW.year ? 'semibold' : 'medium'}
        align="center">
        {yearLabel}
      </Text>
    </TouchableOpacity>
  </Box>
);
