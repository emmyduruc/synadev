import { Box, Button, Text } from '@/components/ui';
import { useTranslate } from '@/hooks/useTranslate';
import { semanticColors } from '@/lib/ui';

export type DashboardDailyLogCardProps = {
  onPress: () => void;
};

/** Soft pastel CTA card matching intro illustration panels. */
export const DashboardDailyLogCard = ({ onPress }: DashboardDailyLogCardProps) => {
  const { t } = useTranslate();

  return (
    <Box
      gap="md"
      padding="lg"
      rounded="xl"
      style={{ backgroundColor: semanticColors.ovum.pastelLavender }}
    >
      <Button fullWidth size="lg" onPress={onPress}>
        {t('dashboard_daily_log_button')}
      </Button>
      <Text size="xs" color="foreground" responsive={false} className="leading-snug text-center">
        {t('dashboard_daily_log_body')}
      </Text>
    </Box>
  );
};
