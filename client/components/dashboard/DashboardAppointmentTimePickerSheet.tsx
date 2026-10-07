import WheelPicker from '@quidone/react-native-wheel-picker';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import {
  formatAppointmentTime,
  parseAppointmentTime,
} from '@/lib/dashboard/appointmentTime';
import { semanticColors } from '@/lib/ui';
import {
  WHEEL_PICKER_HEIGHT,
  WHEEL_PICKER_ITEM_HEIGHT,
  WHEEL_PICKER_VISIBLE_ITEM_COUNT,
  wheelPickerItemTextStyle,
  wheelPickerSelectionOverlayStyle,
} from '@/lib/wizard/wheelPickerNativeStyles';

const HOUR_DATA = Array.from({ length: 24 }, (_, hour) => ({
  value: hour,
  label: String(hour).padStart(2, '0'),
}));

const MINUTE_DATA = Array.from({ length: 60 }, (_, minute) => ({
  value: minute,
  label: String(minute).padStart(2, '0'),
}));

export type DashboardAppointmentTimePickerSheetProps = {
  visible: boolean;
  value: string | null;
  onClose: () => void;
  onConfirm: (time: string) => void;
};

export const DashboardAppointmentTimePickerSheet = ({
  visible,
  value,
  onClose,
  onConfirm,
}: DashboardAppointmentTimePickerSheetProps) => {
  const { t } = useTranslate();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const initialParsed = useMemo(() => parseAppointmentTime(value), [value]);
  const [hour, setHour] = useState(initialParsed.hour);
  const [minute, setMinute] = useState(initialParsed.minute);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const parsed = parseAppointmentTime(value);
    setHour(parsed.hour);
    setMinute(parsed.minute);
  }, [value, visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={{ backgroundColor: semanticColors.page.DEFAULT }}>
          <Box
            className="rounded-t-3xl"
            style={{ backgroundColor: semanticColors.page.DEFAULT }}>
            <Box className="items-center px-5 pt-3 pb-2">
              <View className="h-1 w-10 rounded-full bg-border" />
            </Box>

            <Box className="px-5 pb-3" gap="xs">
              <Text size="lg" weight="bold" family="serif" className="leading-tight">
                {t('dashboard_appointment_edit_time_label')}
              </Text>
            </Box>

            <Box
              direction="row"
              align="center"
              justify="center"
              gap="md"
              className="px-5 pb-4"
              style={{ height: WHEEL_PICKER_HEIGHT }}>
              <Box flex={1} className="overflow-hidden rounded-2xl">
                <WheelPicker
                  data={HOUR_DATA}
                  value={hour}
                  onValueChanged={({ item: { value: nextHour } }) => setHour(nextHour)}
                  itemHeight={WHEEL_PICKER_ITEM_HEIGHT}
                  visibleItemCount={WHEEL_PICKER_VISIBLE_ITEM_COUNT}
                  enableScrollByTapOnItem
                  overlayItemStyle={wheelPickerSelectionOverlayStyle}
                  itemTextStyle={wheelPickerItemTextStyle}
                />
              </Box>
              <Text size="xl" weight="semibold" family="sans" tabularNums>
                :
              </Text>
              <Box flex={1} className="overflow-hidden rounded-2xl">
                <WheelPicker
                  data={MINUTE_DATA}
                  value={minute}
                  onValueChanged={({ item: { value: nextMinute } }) =>
                    setMinute(nextMinute)
                  }
                  itemHeight={WHEEL_PICKER_ITEM_HEIGHT}
                  visibleItemCount={WHEEL_PICKER_VISIBLE_ITEM_COUNT}
                  enableScrollByTapOnItem
                  overlayItemStyle={wheelPickerSelectionOverlayStyle}
                  itemTextStyle={wheelPickerItemTextStyle}
                />
              </Box>
            </Box>

            <Box
              className="px-5 pt-2"
              gap="sm"
              style={{ paddingBottom: safeAreaBottom + 12 }}>
              <Button
                fullWidth
                size="lg"
                onPress={() => onConfirm(formatAppointmentTime(hour, minute))}>
                {t('dashboard_appointment_edit_time_confirm')}
              </Button>
              <Button fullWidth size="lg" variant="soft" onPress={onClose}>
                {t('dashboard_appointment_edit_back')}
              </Button>
            </Box>
          </Box>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
