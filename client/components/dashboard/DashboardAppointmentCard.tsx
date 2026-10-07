import type { UserAppointment } from '@syna/shared-types';

import { DashboardListRow } from '@/components/dashboard/DashboardListRow';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import {
  formatAppointmentDateTimeLabel,
  getAppointmentDaysUntil,
  hasScheduledAppointment,
} from '@/lib/dashboard/appointmentDisplay';

export type DashboardAppointmentCardProps = {
  appointment: UserAppointment;
  onPressChange?: () => void;
  onPressAddQuestions?: () => void;
  onPressAddConcerns?: () => void;
  onPressGoToReport?: () => void;
};

const noop = () => undefined;

export const DashboardAppointmentCard = ({
  appointment,
  onPressChange = noop,
  onPressAddQuestions = noop,
  onPressAddConcerns = noop,
  onPressGoToReport = noop,
}: DashboardAppointmentCardProps) => {
  const { t, language } = useTranslate();
  const hasAppointment = hasScheduledAppointment(appointment);
  const doctorName =
    appointment.doctorName?.trim() || t('dashboard_appointment_practice_name');
  const dateTimeLabel = formatAppointmentDateTimeLabel(appointment, language);
  const daysUntil = getAppointmentDaysUntil(appointment);

  const relativeLabel = (() => {
    if (daysUntil === null) {
      return null;
    }

    if (daysUntil === 0) {
      return t('dashboard_appointment_relative_today');
    }

    if (daysUntil === 1) {
      return t('dashboard_appointment_relative_tomorrow');
    }

    if (daysUntil > 1) {
      return t('dashboard_appointment_relative_in_days', { count: daysUntil });
    }

    return t('dashboard_appointment_relative_past');
  })();

  return (
    <Box className="overflow-hidden rounded-2xl border border-border bg-card px-5 pt-5 pb-1">
      <Box gap="xs">
        <Box direction="row" align="center" justify="between" gap="md">
          <Text size="sm" color="foreground-muted" family="sans" className="leading-snug">
            {t('dashboard_appointment_label')}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('dashboard_appointment_change')}
            onPress={onPressChange}
            hitSlop={8}>
            <Text size="sm" weight="medium" color="primary" family="sans">
              {t('dashboard_appointment_change')}
            </Text>
          </TouchableOpacity>
        </Box>

        {hasAppointment ? (
          <>
            <Text size="xl" weight="semibold" family="serif" className="leading-tight">
              {doctorName}
            </Text>
            {dateTimeLabel ? (
              <Text size="sm" family="sans" tabularNums className="leading-snug">
                {dateTimeLabel}
              </Text>
            ) : null}
            {relativeLabel ? (
              <Text
                size="sm"
                color="foreground-muted"
                family="sans"
                tabularNums
                className="leading-snug">
                {relativeLabel}
              </Text>
            ) : null}
          </>
        ) : (
          <Text size="sm" color="foreground-muted" family="sans" className="leading-relaxed">
            {t('dashboard_appointment_empty')}
          </Text>
        )}
      </Box>

      <Box className="mt-5">
        <Text size="base" weight="bold" family="serif" className="mb-1 leading-tight">
          {t('dashboard_appointment_prepare_heading')}
        </Text>

        <DashboardListRow
          title={t('dashboard_appointment_add_questions')}
          onPress={onPressAddQuestions}
        />
        <DashboardListRow
          title={t('dashboard_appointment_add_concerns')}
          onPress={onPressAddConcerns}
        />
        <DashboardListRow
          title={t('dashboard_appointment_go_to_report')}
          onPress={onPressGoToReport}
          showDivider={false}
        />
      </Box>
    </Box>
  );
};
