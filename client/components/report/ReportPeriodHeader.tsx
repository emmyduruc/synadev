import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';

export type ReportPeriodHeaderProps = {
  monthYearLabel: string;
  windowDays: number;
  rangeLabel: string;
  onChangePeriod: () => void;
};

export const ReportPeriodHeader = ({
  monthYearLabel,
  windowDays,
  rangeLabel,
  onChangePeriod,
}: ReportPeriodHeaderProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="sm">
      <Box gap="xs">
        <Text size="2xl" weight="bold" className="leading-tight">
          {t('report_period_title', {
            monthYear: monthYearLabel,
            days: windowDays,
          })}
        </Text>
        <Text size="sm" color="foreground-muted" className="leading-relaxed">
          {rangeLabel}
        </Text>
        <Text size="xs" color="foreground-muted" className="leading-relaxed">
          {t('report_period_appointment_placeholder')}
        </Text>
      </Box>

      <Box direction="row" align="center" justify="between" gap="sm">
        <Box className="rounded-full bg-primary-100 px-3 py-1.5">
          <Text size="2xs" weight="medium" color="foreground">
            {t('report_period_status_placeholder')}
          </Text>
        </Box>

        <TouchableOpacity
          accessibilityRole="button"
          onPress={onChangePeriod}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text size="sm" weight="medium" color="primary">
            {t('report_period_change')}
          </Text>
        </TouchableOpacity>
      </Box>
    </Box>
  );
};
