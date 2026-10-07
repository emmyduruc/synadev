import type { UpdateUserAppointment, UserAppointment } from '@syna/shared-types';
import { useEffect, useState } from 'react';
import { Modal, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DashboardAppointmentDatePickerSheet } from '@/components/dashboard/DashboardAppointmentDatePickerSheet';
import { DashboardAppointmentTimePickerSheet } from '@/components/dashboard/DashboardAppointmentTimePickerSheet';
import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { CalendarIcon } from '@/components/ui/icons/CalendarIcon';
import { ClockIcon } from '@/components/ui/icons/ClockIcon';
import { Text } from '@/components/ui/Text';
import { TextInput } from '@/components/ui/TextInput';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { formatIsoDateToDisplay } from '@/lib/dashboard/appointmentDisplay';
import { borderColorClasses, cn, radiusClasses, semanticColors } from '@/lib/ui';

export type DashboardAppointmentEditSheetProps = {
  visible: boolean;
  appointment: UserAppointment;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (next: UpdateUserAppointment) => void | Promise<void>;
  onCancelAppointment: () => void | Promise<void>;
};

export const DashboardAppointmentEditSheet = ({
  visible,
  appointment,
  isSaving = false,
  onClose,
  onSave,
  onCancelAppointment,
}: DashboardAppointmentEditSheetProps) => {
  const { t } = useTranslate();
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets();
  const [dateIso, setDateIso] = useState<string | null>(null);
  const [doctorValue, setDoctorValue] = useState('');
  const [timeValue, setTimeValue] = useState<string | null>(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setDateIso(appointment.appointmentDate);
    setDoctorValue(appointment.doctorName ?? '');
    setTimeValue(appointment.appointmentTime);
    setIsDatePickerVisible(false);
    setIsTimePickerVisible(false);
  }, [appointment, visible]);

  const handleSave = async () => {
    await onSave({
      appointmentDate: dateIso,
      appointmentTime: timeValue,
      doctorName: doctorValue.trim() || null,
    });
    onClose();
  };

  const handleCancelAppointment = async () => {
    await onCancelAppointment();
    onClose();
  };

  const dateDisplay = formatIsoDateToDisplay(dateIso);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <Box
        flex={1}
        style={{
          paddingTop: safeAreaTop,
          backgroundColor: semanticColors.page.DEFAULT,
        }}>
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}>
          <Box paddingX="lg" className="pt-6" gap="lg">
            <Box gap="sm">
              <Text size="xl" weight="bold" family="serif" className="leading-tight">
                {t('dashboard_appointment_edit_title')}
              </Text>
              <Text
                size="sm"
                color="foreground-muted"
                family="sans"
                className="leading-relaxed">
                {t('dashboard_appointment_edit_subtitle')}
              </Text>
            </Box>

            <Box gap="md">
              <Box className="w-full">
                <Text size="sm" weight="medium" color="foreground" className="mb-1.5">
                  {t('dashboard_appointment_edit_date_label')}
                </Text>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={t('dashboard_appointment_edit_date_label')}
                  onPress={() => setIsDatePickerVisible(true)}>
                  <Box
                    direction="row"
                    align="center"
                    className={cn(
                      'w-full min-h-12 border bg-white/90 overflow-hidden',
                      radiusClasses.xl,
                      borderColorClasses['foreground-muted'],
                    )}>
                    <Box flex={1} className="px-4 py-3">
                      {dateDisplay ? (
                        <Text size="base" family="sans" tabularNums>
                          {dateDisplay}
                        </Text>
                      ) : (
                        <Text size="base" color="foreground-muted" family="sans" tabularNums>
                          {t('dashboard_appointment_edit_date_placeholder')}
                        </Text>
                      )}
                    </Box>
                    <Box paddingX="sm">
                      <CalendarIcon size={20} color={semanticColors.foregroundMuted} />
                    </Box>
                  </Box>
                </TouchableOpacity>
              </Box>

              <TextInput
                label={t('dashboard_appointment_edit_doctor_label')}
                value={doctorValue}
                onChangeText={setDoctorValue}
                placeholder={t('dashboard_appointment_edit_doctor_placeholder')}
              />

              <Box className="w-full">
                <Text size="sm" weight="medium" color="foreground" className="mb-1.5">
                  {t('dashboard_appointment_edit_time_label')}
                </Text>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={t('dashboard_appointment_edit_time_label')}
                  onPress={() => setIsTimePickerVisible(true)}>
                  <Box
                    direction="row"
                    align="center"
                    className={cn(
                      'w-full min-h-12 border bg-white/90 overflow-hidden',
                      radiusClasses.xl,
                      borderColorClasses['foreground-muted'],
                    )}>
                    <Box flex={1} className="px-4 py-3">
                      {timeValue ? (
                        <Text size="base" family="sans" tabularNums>
                          {timeValue}
                        </Text>
                      ) : (
                        <Text size="base" color="foreground-muted" family="sans" tabularNums>
                          {t('dashboard_appointment_edit_time_placeholder')}
                        </Text>
                      )}
                    </Box>
                    <Box paddingX="sm">
                      <ClockIcon size={20} color={semanticColors.foregroundMuted} />
                    </Box>
                  </Box>
                </TouchableOpacity>
              </Box>
            </Box>
          </Box>
        </ScrollView>

        <Box
          paddingX="lg"
          gap="sm"
          style={{ paddingBottom: safeAreaBottom + 16, paddingTop: 8 }}>
          <Button
            fullWidth
            size="lg"
            loading={isSaving}
            onPress={() => {
              void handleSave();
            }}>
            {t('dashboard_appointment_edit_save')}
          </Button>
          <Button
            fullWidth
            size="lg"
            variant="soft"
            disabled={isSaving}
            onPress={() => {
              void handleCancelAppointment();
            }}>
            {t('dashboard_appointment_edit_cancel_appointment')}
          </Button>
          <Button fullWidth size="lg" variant="soft" disabled={isSaving} onPress={onClose}>
            {t('dashboard_appointment_edit_back')}
          </Button>
        </Box>
      </Box>

      <DashboardAppointmentDatePickerSheet
        visible={isDatePickerVisible}
        value={dateIso}
        onClose={() => setIsDatePickerVisible(false)}
        onConfirm={(nextDate) => {
          setDateIso(nextDate);
          setIsDatePickerVisible(false);
        }}
      />

      <DashboardAppointmentTimePickerSheet
        visible={isTimePickerVisible}
        value={timeValue}
        onClose={() => setIsTimePickerVisible(false)}
        onConfirm={(nextTime) => {
          setTimeValue(nextTime);
          setIsTimePickerVisible(false);
        }}
      />
    </Modal>
  );
};
