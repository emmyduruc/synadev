import { View } from 'react-native';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { semanticColors } from '@/lib/ui';

export type ReportPeriodNotice = {
  currentDocumentedDays: number;
  previousDocumentedDays: number;
};

export type ReportPeriodHeaderProps = {
  monthYearLabel: string;
  windowDays: number;
  rangeLabel: string;
  periodNotice?: ReportPeriodNotice | null;
  onChangePeriod: () => void;
};

export const ReportPeriodHeader = ({
  monthYearLabel,
  windowDays,
  rangeLabel,
  periodNotice = null,
  onChangePeriod,
}: ReportPeriodHeaderProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="md">
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
        <Text size="xs" color="foreground-subtle" className="leading-relaxed">
          {t('report_period_appointment_placeholder')}
        </Text>
      </Box>

      <Box direction="row" align="center" justify="between" gap="sm">
        <View
          className="rounded-full px-3 py-1.5"
          style={{ backgroundColor: semanticColors.report.dataBackground }}>
          <Text size="2xs" weight="medium" color="foreground">
            {t('report_period_status_placeholder')}
          </Text>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          onPress={onChangePeriod}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text size="sm" weight="medium" color="foreground">
            {t('report_period_change')}
          </Text>
        </TouchableOpacity>
      </Box>

      {periodNotice ? (
        <View
          className="rounded-2xl px-4 py-3.5"
          style={{ backgroundColor: semanticColors.report.dataBackground }}>
          <Text size="sm" color="foreground" className="leading-relaxed">
            {t('report_period_documented_notice', {
              current: periodNotice.currentDocumentedDays,
              previous: periodNotice.previousDocumentedDays,
            })}
          </Text>
        </View>
      ) : null}
    </Box>
  );
};
