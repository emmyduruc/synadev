import { useEffect, useState } from 'react';
import { Modal, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DashboardAppointmentTimePickerSheet } from '@/components/dashboard/DashboardAppointmentTimePickerSheet';
import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { ClockIcon } from '@/components/ui/icons/ClockIcon';
import { Text } from '@/components/ui/Text';
import { TextInput } from '@/components/ui/TextInput';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { borderColorClasses, cn, radiusClasses, semanticColors } from '@/lib/ui';

export type DashboardAppointmentEditSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSave?: () => void;
  onCancelAppointment?: () => void;
};

export const DashboardAppointmentEditSheet = ({
  visible,
  onClose,
  onSave,
  onCancelAppointment,
}: DashboardAppointmentEditSheetProps) => {
  const { t } = useTranslate();
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets();
  const [dateValue, setDateValue] = useState('');
  const [doctorValue, setDoctorValue] = useState('');
  const [timeValue, setTimeValue] = useState<string | null>(null);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setDateValue('');
    setDoctorValue('');
    setTimeValue(null);
    setIsTimePickerVisible(false);
  }, [visible]);

  const handleSave = () => {
    onSave?.();
    onClose();
  };

  const handleCancelAppointment = () => {
    onCancelAppointment?.();
    onClose();
  };

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
              <TextInput
                label={t('dashboard_appointment_edit_date_label')}
                value={dateValue}
                onChangeText={setDateValue}
                placeholder={t('dashboard_appointment_edit_date_placeholder')}
                inputClassName="tabular-nums"
                autoCapitalize="none"
                autoCorrect={false}
              />
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
          <Button fullWidth size="lg" onPress={handleSave}>
            {t('dashboard_appointment_edit_save')}
          </Button>
          <Button fullWidth size="lg" variant="soft" onPress={handleCancelAppointment}>
            {t('dashboard_appointment_edit_cancel_appointment')}
          </Button>
          <Button fullWidth size="lg" variant="soft" onPress={onClose}>
            {t('dashboard_appointment_edit_back')}
          </Button>
        </Box>
      </Box>

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
