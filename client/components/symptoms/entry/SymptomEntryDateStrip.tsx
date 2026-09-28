import { useEffect, useMemo, useRef } from 'react';
import { FlatList, type ListRenderItem } from 'react-native';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { buildRecentDays, type SelectableDay } from '@/lib/date/dateKeys';
import { SYMPTOM_ENTRY_DATE_STRIP_DAYS } from '@/lib/symptoms/symptomEntryConstants';
import { cn } from '@/lib/ui';

export type SymptomEntryDateStripProps = {
  selectedDateKey: string;
  onChangeDate: (dateKey: string) => void;
};

const ITEM_WIDTH = 64;
const ITEM_GAP = 8;
const ITEM_TOTAL = ITEM_WIDTH + ITEM_GAP;

const formatWeekday = (date: Date): string =>
  date.toLocaleDateString(undefined, { weekday: 'short' });

const formatSelectedDate = (date: Date): string =>
  date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

export const SymptomEntryDateStrip = ({
  selectedDateKey,
  onChangeDate,
}: SymptomEntryDateStripProps) => {
  const { t } = useTranslate();
  const listRef = useRef<FlatList<SelectableDay>>(null);
  const hasCenteredOnce = useRef(false);
  const days = useMemo(() => buildRecentDays(SYMPTOM_ENTRY_DATE_STRIP_DAYS), []);

  const selectedIndex = useMemo(
    () => days.findIndex((day) => day.dateKey === selectedDateKey),
    [days, selectedDateKey],
  );

  const selectedDay = selectedIndex >= 0 ? days[selectedIndex] : undefined;

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
        onPress={() => onChangeDate(item.dateKey)}
        style={{ width: ITEM_WIDTH, marginRight: ITEM_GAP }}>
        <Box
          align="center"
          justify="center"
          gap="xs"
          className={cn(
            'rounded-2xl border px-2 py-2.5',
            isSelected
              ? 'border-primary-500 bg-primary-500'
              : 'border-border bg-card',
          )}>
          <Text
            size="2xs"
            weight="medium"
            color={isSelected ? 'white' : 'foreground-muted'}
            responsive={false}
            numberOfLines={1}>
            {formatWeekday(item.date)}
          </Text>
          <Text
            size="base"
            weight="bold"
            color={isSelected ? 'white' : 'foreground'}
            responsive={false}>
            {item.date.getDate()}
          </Text>
        </Box>
      </TouchableOpacity>
    );
  };

  return (
    <Box gap="sm">
      <FlatList
        ref={listRef}
        data={days as SelectableDay[]}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.dateKey}
        renderItem={renderItem}
        getItemLayout={(_, index) => ({
          length: ITEM_TOTAL,
          offset: ITEM_TOTAL * index,
          index,
        })}
        onScrollToIndexFailed={({ index }) => {
          setTimeout(() => {
            listRef.current?.scrollToIndex({ index, viewPosition: 0.5, animated: false });
          }, 60);
        }}
      />
      {selectedDay ? (
        <Text size="xs" color="foreground-muted" className="leading-relaxed">
          {`${formatSelectedDate(selectedDay.date)}. ${t('symptom_entry_date_caption')}`}
        </Text>
      ) : null}
    </Box>
  );
};
