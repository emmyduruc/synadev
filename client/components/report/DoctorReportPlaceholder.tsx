import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';

export type DoctorReportPlaceholderProps = {
  message?: string;
};

export const DoctorReportPlaceholder = ({
  message,
}: DoctorReportPlaceholderProps) => {
  const { t } = useTranslate();

  return (
    <Box flex={1} align="center" justify="center" padding="lg" className="min-h-80">
      <Text size="xl" weight="semibold" align="center" className="text-black">
        {message ?? t('report_doctor_placeholder')}
      </Text>
    </Box>
  );
};
