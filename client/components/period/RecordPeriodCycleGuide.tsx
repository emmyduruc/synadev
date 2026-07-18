import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';

export const RecordPeriodCycleGuide = () => {
  const { t } = useTranslate();

  return (
    <Box className="rounded-3xl border border-primary-100 bg-primary-50/80 p-4">
      <Box direction="row" align="center" gap="md">
        <Box flex={1} gap="xs">
          <Text size="lg" weight="bold" className="leading-tight">
            {t('record_period_title')}
          </Text>
          <Text size="xs" color="foreground-muted" className="leading-relaxed">
            {t('record_period_subtitle')}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
