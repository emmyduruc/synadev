import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { useTranslate } from '@/hooks/useTranslate';
import { semanticColors } from '@/lib/ui';

const softButtonStyle = { backgroundColor: semanticColors.report.dataBackground };

export type ReportActionsSectionProps = {
  onPressCreatePdf?: () => void;
  onPressAppointmentMode?: () => void;
  onPressGiveFeedback?: () => void;
  onPressEarlierReports?: () => void;
};

export const ReportActionsSection = ({
  onPressCreatePdf,
  onPressAppointmentMode,
  onPressGiveFeedback,
  onPressEarlierReports,
}: ReportActionsSectionProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="sm">
      <Button
        fullWidth
        size="lg"
        onPress={onPressCreatePdf ?? (() => undefined)}
        className="rounded-2xl border-0 bg-foreground"
        textClassName="text-white">
        {t('report_action_create_pdf')}
      </Button>

      <Button
        variant="outline"
        fullWidth
        size="lg"
        onPress={onPressAppointmentMode ?? (() => undefined)}
        style={softButtonStyle}
        className="rounded-2xl border-0"
        textClassName="text-foreground">
        {t('report_action_appointment_mode')}
      </Button>

      <Button
        variant="outline"
        fullWidth
        size="lg"
        onPress={onPressGiveFeedback ?? (() => undefined)}
        style={softButtonStyle}
        className="rounded-2xl border-0"
        textClassName="text-foreground">
        {t('report_action_give_feedback')}
      </Button>

      <Button
        variant="outline"
        fullWidth
        size="lg"
        onPress={onPressEarlierReports ?? (() => undefined)}
        style={softButtonStyle}
        className="rounded-2xl border-0"
        textClassName="text-foreground">
        {t('report_action_earlier_reports')}
      </Button>
    </Box>
  );
};
