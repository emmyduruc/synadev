import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

export type DailyLogModalProps = {
  title: string;
  selectedDateKey: string;
  onChangeDate: (dateKey: string) => void;
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
  children: ReactNode;
};

export const DailyLogModal = ({
  title,
  selectedDateKey,
  onChangeDate,
  onCancel,
  onSave,
  isSaving = false,
  children,
}: DailyLogModalProps) => {
  const { t } = useTranslate();
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets();

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
    <Box flex={1} fullWidth background="background">
      <Box style={{ paddingTop: safeAreaTop }}>
        <Box align="center" paddingX="lg" paddingY="sm">
          <Text size="lg" weight="bold">
            {title}
          </Text>
        </Box>

        <Box direction="row" align="center" justify="between" paddingX="lg">
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

        <Box paddingY="sm">
          <DailyLogDateWheel
            days={days}
            selectedDateKey={selectedDateKey}
            onSelect={onChangeDate}
          />
        </Box>
      </Box>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: 24 }}>
        <Box paddingX="lg" paddingY="md" gap="lg">
          {children}
        </Box>
      </ScrollView>

      <Box
        direction="row"
        align="center"
        justify="between"
        className="border-t border-border bg-card px-2 py-3"
        style={{ paddingBottom: safeAreaBottom + 12 }}>
        <TouchableOpacity
          accessibilityRole="button"
          disabled={isSaving}
          onPress={onCancel}
          className="min-h-11 justify-center px-4 py-2">
          <Text size="base" color="primary" weight="medium">
            {t('daily_log_cancel_button')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          disabled={isSaving}
          onPress={onSave}
          className="min-h-11 justify-center px-4 py-2">
          <Text size="base" color="primary" weight="bold">
            {t('daily_log_save_button')}
          </Text>
        </TouchableOpacity>
      </Box>
    </Box>
  );
};
