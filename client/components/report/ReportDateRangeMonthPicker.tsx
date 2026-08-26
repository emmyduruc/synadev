import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { cn } from '@/lib/ui';

export type ReportDateRangeMonthPickerProps = {
  year: number;
  selectedMonthIndex: number;
  enabledMonthIndexes: ReadonlySet<number>;
  onSelectMonth: (monthIndex: number) => void;
};

export const ReportDateRangeMonthPicker = ({
  year,
  selectedMonthIndex,
  enabledMonthIndexes,
  onSelectMonth,
}: ReportDateRangeMonthPickerProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="md">
      <Text size="sm" weight="semibold" align="center" className="text-black/70">
        {year}
      </Text>
      <Box direction="row" className="flex-wrap gap-2">
        {Array.from({ length: 12 }, (_, monthIndex) => {
          const isSelected = monthIndex === selectedMonthIndex;
          const isEnabled = enabledMonthIndexes.has(monthIndex);

          return (
            <TouchableOpacity
              key={monthIndex}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected, disabled: !isEnabled }}
              disabled={!isEnabled}
              onPress={() => onSelectMonth(monthIndex)}
              className={cn(
                'min-w-[30%] flex-1 items-center rounded-2xl border px-2 py-3.5',
                isSelected
                  ? 'border-primary-400 bg-primary-500'
                  : 'border-border bg-card',
                !isEnabled && 'opacity-35',
              )}>
              <Text
                size="xs"
                weight="semibold"
                className={isSelected ? 'text-white' : 'text-black'}>
                {t(`calendar_month_${monthIndex + 1}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Box>
    </Box>
  );
};
