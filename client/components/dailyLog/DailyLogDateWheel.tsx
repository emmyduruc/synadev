import { useEffect, useMemo, useRef } from 'react';
import { FlatList, type ListRenderItem } from 'react-native';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import type { SelectableDay } from '@/lib/date/dateKeys';
import { cn } from '@/lib/ui';

export type DailyLogDateWheelProps = {
  days: readonly SelectableDay[];
  selectedDateKey: string;
  onSelect: (dateKey: string) => void;
};

/** Fixed item metrics keep getItemLayout / scrollToIndex reliable across renders. */
const ITEM_WIDTH = 52;
const ITEM_SPACING = 4;
const ITEM_TOTAL_WIDTH = ITEM_WIDTH + ITEM_SPACING * 2;

const formatWeekday = (date: Date): string =>
  date.toLocaleDateString(undefined, { weekday: 'short' });

export const DailyLogDateWheel = ({
  days,
  selectedDateKey,
  onSelect,
}: DailyLogDateWheelProps) => {
  const listRef = useRef<FlatList<SelectableDay>>(null);
  const hasCenteredOnce = useRef(false);

  const selectedIndex = useMemo(
    () => days.findIndex((day) => day.dateKey === selectedDateKey),
    [days, selectedDateKey],
  );

  useEffect(() => {
    if (selectedIndex < 0) {
      return;
    }

    listRef.current?.scrollToIndex({
      index: selectedIndex,
      viewPosition: 0.5,
      animated: hasCenteredOnce.current,
    });
    hasCenteredOnce.current = true;
  }, [selectedIndex]);

  const renderItem: ListRenderItem<SelectableDay> = ({ item }) => {
    const isSelected = item.dateKey === selectedDateKey;

    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        onPress={() => onSelect(item.dateKey)}
        style={{ width: ITEM_WIDTH, marginHorizontal: ITEM_SPACING }}>
        <Box align="center" gap="xs">
          <Text
            size="2xs"
            weight="medium"
            color={isSelected ? 'primary' : 'foreground-muted'}
            responsive={false}>
            {formatWeekday(item.date)}
          </Text>
          <Box
            align="center"
            justify="center"
            className={cn(
              'h-11 w-11 rounded-full',
              isSelected && 'bg-primary-500',
              !isSelected && item.isToday && 'bg-primary-500/15',
              !isSelected && !item.isToday && 'bg-card',
            )}>
            <Text
              size="base"
              weight={isSelected || item.isToday ? 'bold' : 'medium'}
              color={isSelected ? 'white' : 'foreground'}
              responsive={false}>
              {item.date.getDate()}
            </Text>
          </Box>
        </Box>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      ref={listRef}
      data={days as SelectableDay[]}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.dateKey}
      renderItem={renderItem}
      getItemLayout={(_, index) => ({
        length: ITEM_TOTAL_WIDTH,
        offset: ITEM_TOTAL_WIDTH * index,
        index,
      })}
      onScrollToIndexFailed={({ index }) => {
        setTimeout(() => {
          listRef.current?.scrollToIndex({ index, viewPosition: 0.5, animated: false });
        }, 60);
      }}
      contentContainerStyle={{ paddingHorizontal: ITEM_SPACING }}
    />
  );
};
