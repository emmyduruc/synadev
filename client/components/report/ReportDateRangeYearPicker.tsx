import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { cn } from '@/lib/ui';

export type ReportDateRangeYearPickerProps = {
  years: readonly number[];
  selectedYear: number;
  onSelectYear: (year: number) => void;
};

export const ReportDateRangeYearPicker = ({
  years,
  selectedYear,
  onSelectYear,
}: ReportDateRangeYearPickerProps) => (
  <Box direction="row" className="flex-wrap gap-2">
    {years.map((year) => {
      const isSelected = year === selectedYear;

      return (
        <TouchableOpacity
          key={year}
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected }}
          onPress={() => onSelectYear(year)}
          className={cn(
            'min-w-[28%] flex-1 items-center rounded-2xl border px-3 py-4',
            isSelected
              ? 'border-primary-400 bg-primary-500'
              : 'border-border bg-card',
          )}>
          <Text
            size="base"
            weight="semibold"
            className={isSelected ? 'text-white' : 'text-black'}>
            {year}
          </Text>
        </TouchableOpacity>
      );
    })}
  </Box>
);
