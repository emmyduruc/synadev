import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { useTranslate } from '@/hooks/useTranslate';
import { semanticColors } from '@/lib/ui';

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
        className="rounded-2xl border-0"
        style={{ backgroundColor: semanticColors.ink2 }}
        textClassName="text-white">
        {t('report_action_create_pdf')}
      </Button>

      <Button
        variant="soft"
        fullWidth
        size="lg"
        onPress={onPressAppointmentMode ?? (() => undefined)}
        className="rounded-2xl">
        {t('report_action_appointment_mode')}
      </Button>

      <Button
        variant="soft"
        fullWidth
        size="lg"
        onPress={onPressGiveFeedback ?? (() => undefined)}
        className="rounded-2xl">
        {t('report_action_give_feedback')}
      </Button>

      <Button
        variant="soft"
        fullWidth
        size="lg"
        onPress={onPressEarlierReports ?? (() => undefined)}
        className="rounded-2xl">
        {t('report_action_earlier_reports')}
      </Button>
    </Box>
  );
};
