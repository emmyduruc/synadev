import { DashboardListRow } from '@/components/dashboard/DashboardListRow';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';

export type DashboardAppointmentCardProps = {
  onPressChange?: () => void;
  onPressAddQuestions?: () => void;
  onPressAddConcerns?: () => void;
  onPressGoToReport?: () => void;
};

const noop = () => undefined;

export const DashboardAppointmentCard = ({
  onPressChange = noop,
  onPressAddQuestions = noop,
  onPressAddConcerns = noop,
  onPressGoToReport = noop,
}: DashboardAppointmentCardProps) => {
  const { t } = useTranslate();

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

        <Text size="xl" weight="semibold" family="serif" className="leading-tight">
          {t('dashboard_appointment_practice_name')}
        </Text>

        <Text size="sm" family="sans" tabularNums className="leading-snug">
          {t('dashboard_appointment_datetime')}
        </Text>
        <Text
          size="sm"
          color="foreground-muted"
          family="sans"
          tabularNums
          className="leading-snug">
          {t('dashboard_appointment_relative')}
        </Text>
      </Box>

      <Box className="mt-5">
        <Text
          size="base"
          weight="bold"
          family="serif"
          className="mb-1 leading-tight">
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
