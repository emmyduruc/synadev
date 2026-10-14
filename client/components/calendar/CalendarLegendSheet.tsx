import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CalendarLegendRow } from '@/components/calendar/CalendarLegendRow';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { CALENDAR_LEGEND_ITEMS } from '@/lib/calendar/calendarMarkerVisuals';
import { semanticColors } from '@/lib/ui';

export type CalendarLegendSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export const CalendarLegendSheet = ({ visible, onClose }: CalendarLegendSheetProps) => {
  const { t } = useTranslate();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const closeFooterHeight = 56 + safeAreaBottom;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
        <Pressable
          className="max-h-[88%]"
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

            <Box className="px-5 pb-3" gap="xs">
              <Text size="xl" weight="bold" family="serif" className="leading-tight">
                {t('calendar_legend_title')}
              </Text>
              <Text size="sm" color="foreground-muted" className="leading-relaxed">
                {t('calendar_legend_subtitle')}
              </Text>
            </Box>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: closeFooterHeight,
                gap: 16,
              }}>
              <Box
                className="overflow-hidden rounded-2xl border border-border bg-card px-4 py-4"
                gap="lg">
                {CALENDAR_LEGEND_ITEMS.map((item) => (
                  <CalendarLegendRow key={item.id} item={item} />
                ))}
              </Box>

              <Box
                className="overflow-hidden rounded-2xl border border-border bg-card px-4 py-3"
                gap="xs">
                <Text size="xs" color="foreground-muted" className="leading-relaxed">
                  {t('calendar_legend_track_hint')}
                </Text>
                <Text size="xs" color="foreground-muted" className="leading-relaxed">
                  {t('calendar_legend_tap_hint')}
                </Text>
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
                  {t('calendar_legend_close_button')}
                </Text>
              </TouchableOpacity>
            </View>
          </Box>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
