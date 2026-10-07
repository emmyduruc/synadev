import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CalendarMonthView } from '@/components/calendar/CalendarMonthView';
import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '@/components/ui/icons/ChevronRightIcon';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { buildMonthGrid } from '@/lib/dashboard/calendarUtils';
import { toDateKey } from '@/lib/date/dateKeys';
import { semanticColors } from '@/lib/ui';

export type DashboardAppointmentDatePickerSheetProps = {
  visible: boolean;
  value: string | null;
  onClose: () => void;
  onConfirm: (dateKey: string) => void;
};

const resolveInitialDateKey = (value: string | null): string => {
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  return toDateKey(new Date());
};

export const DashboardAppointmentDatePickerSheet = ({
  visible,
  value,
  onClose,
  onConfirm,
}: DashboardAppointmentDatePickerSheetProps) => {
  const { t } = useTranslate();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const initialDateKey = useMemo(() => resolveInitialDateKey(value), [value]);
  const [draftDateKey, setDraftDateKey] = useState(initialDateKey);
  const [viewYear, setViewYear] = useState(() => Number(initialDateKey.slice(0, 4)));
  const [viewMonthIndex, setViewMonthIndex] = useState(
    () => Number(initialDateKey.slice(5, 7)) - 1,
  );

  useEffect(() => {
    if (!visible) {
      return;
    }

    const nextDateKey = resolveInitialDateKey(value);
    setDraftDateKey(nextDateKey);
    setViewYear(Number(nextDateKey.slice(0, 4)));
    setViewMonthIndex(Number(nextDateKey.slice(5, 7)) - 1);
  }, [value, visible]);

  const month = useMemo(
    () => ({
      monthIndex: viewMonthIndex,
      year: viewYear,
      labelKey: `calendar_month_${viewMonthIndex + 1}`,
      weeks: buildMonthGrid(viewYear, viewMonthIndex),
    }),
    [viewMonthIndex, viewYear],
  );

  const selectedDateKeys = useMemo(() => new Set([draftDateKey]), [draftDateKey]);

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonthIndex + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonthIndex(next.getMonth());
  };

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
                {t('dashboard_appointment_edit_date_label')}
              </Text>
            </Box>

            <Box
              direction="row"
              align="center"
              justify="between"
              className="px-5 pb-3"
              gap="md">
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={t('dashboard_appointment_edit_date_prev_month')}
                hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                onPress={() => shiftMonth(-1)}
                className="h-10 w-10 items-center justify-center rounded-full bg-card">
                <ChevronLeftIcon size={20} color={semanticColors.foreground} />
              </TouchableOpacity>

              <Text size="base" weight="bold" align="center" className="min-w-0 flex-1">
                {`${t(month.labelKey)} ${viewYear}`}
              </Text>

              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={t('dashboard_appointment_edit_date_next_month')}
                hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                onPress={() => shiftMonth(1)}
                className="h-10 w-10 items-center justify-center rounded-full bg-card">
                <ChevronRightIcon size={20} color={semanticColors.foreground} />
              </TouchableOpacity>
            </Box>

            <Box className="px-4 pb-2">
              <CalendarMonthView
                months={[month]}
                selectedDateKeys={selectedDateKeys}
                showMonthHeader={false}
                onPressDate={setDraftDateKey}
              />
            </Box>

            <Box
              className="px-5 pt-2"
              gap="sm"
              style={{ paddingBottom: safeAreaBottom + 12 }}>
              <Button fullWidth size="lg" onPress={() => onConfirm(draftDateKey)}>
                {t('dashboard_appointment_edit_date_confirm')}
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
