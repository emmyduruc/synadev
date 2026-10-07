import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import {
  CALENDAR_DAY_SUMMARY_SEPARATOR,
  type CalendarDaySummary,
  type CalendarDaySummaryLine,
} from '@/lib/calendar/buildCalendarDaySummary';
import { semanticColors } from '@/lib/ui';

export type CalendarDaySummarySheetProps = {
  summary: CalendarDaySummary | null;
  visible: boolean;
  onClose: () => void;
  onEdit: (dateKey: string) => void;
};

const formatDisplayDate = (dateKey: string, language: string): string => {
  const date = new Date(`${dateKey}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateKey;
  }

  return date.toLocaleDateString(language, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
};

const resolveLineValue = (
  line: CalendarDaySummaryLine,
  t: (key: string, options?: Record<string, unknown>) => string,
): string => {
  if (line.valueLiteral) {
    return line.valueLiteral;
  }

  if (line.valueKeys && line.valueKeys.length > 0) {
    return line.valueKeys.map((key) => t(key)).join(', ');
  }

  if (line.valueKey) {
    return t(line.valueKey, line.valueParams);
  }

  return '';
};

const formatLineText = (
  line: CalendarDaySummaryLine,
  t: (key: string, options?: Record<string, unknown>) => string,
): string => {
  const label = t(line.labelKey);
  const value = resolveLineValue(line, t);

  if (!value) {
    return label;
  }

  if (line.separator === CALENDAR_DAY_SUMMARY_SEPARATOR.dot) {
    return `${label} · ${value}`;
  }

  return `${label}: ${value}`;
};

export const CalendarDaySummarySheet = ({
  summary,
  visible,
  onClose,
  onEdit,
}: CalendarDaySummarySheetProps) => {
  const { t, language } = useTranslate();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const closeFooterHeight = 56 + safeAreaBottom;

  if (!summary) {
    return null;
  }

  const displayDate = formatDisplayDate(summary.dateKey, language);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
        <Pressable
          className="max-h-[92%]"
          onPress={(event) => event.stopPropagation()}
          style={{ backgroundColor: semanticColors.page.DEFAULT }}>
          <Box
            className="rounded-t-3xl"
            style={{
              backgroundColor: semanticColors.page.DEFAULT,
              maxHeight: '100%',
            }}>
            <Box className="items-center px-5 pt-3 pb-2">
              <View className="h-1 w-10 rounded-full bg-border" />
            </Box>

            <Box className="px-5 pb-3">
              <Text size="xl" weight="bold" family="serif" className="leading-tight">
                {displayDate}
              </Text>
            </Box>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: closeFooterHeight,
                gap: 12,
              }}>
              <Box
                className="overflow-hidden rounded-2xl border border-border bg-card px-4 py-4"
                gap="md">
                <Box direction="row" align="center" justify="between">
                  <Text size="base" weight="bold">
                    {t('calendar_day_summary_entry_title')}
                  </Text>
                  <TouchableOpacity
                    accessibilityRole="button"
                    hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                    onPress={() => onEdit(summary.dateKey)}>
                    <Text size="sm" weight="semibold" color="primary">
                      {t('calendar_day_summary_edit_button')}
                    </Text>
                  </TouchableOpacity>
                </Box>

                {summary.entryLines.length > 0 ? (
                  <Box gap="sm">
                    {summary.entryLines.map((line) => (
                      <Text
                        key={line.id}
                        size="sm"
                        color="foreground-muted"
                        className="leading-relaxed">
                        {formatLineText(line, t)}
                      </Text>
                    ))}
                  </Box>
                ) : (
                  <Text size="sm" color="foreground-muted" className="leading-relaxed">
                    {t('calendar_day_summary_entry_empty')}
                  </Text>
                )}
              </Box>

              <Box
                className="overflow-hidden rounded-2xl border border-border bg-card px-4 py-4"
                gap="md">
                <Text size="base" weight="bold">
                  {t('calendar_day_summary_health_title')}
                </Text>

                {summary.hasHealthContent ? (
                  <Box gap="sm">
                    {summary.healthLines.map((line) => (
                      <Text
                        key={line.id}
                        size="sm"
                        color="foreground-muted"
                        className="leading-relaxed">
                        {formatLineText(line, t)}
                      </Text>
                    ))}
                  </Box>
                ) : (
                  <Text size="sm" color="foreground-muted" className="leading-relaxed">
                    {t('calendar_day_summary_health_empty')}
                  </Text>
                )}
              </Box>
            </ScrollView>

            <View
              pointerEvents="box-none"
              className="absolute inset-x-0 bottom-0 items-center px-5 pt-2"
              style={{
                paddingBottom: safeAreaBottom + 12,
                backgroundColor: semanticColors.page.DEFAULT,
              }}>
              <TouchableOpacity accessibilityRole="button" onPress={onClose} className="py-2">
                <Text size="sm" weight="semibold" color="foreground-muted">
                  {t('calendar_day_summary_close_button')}
                </Text>
              </TouchableOpacity>
            </View>
          </Box>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
