import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';

export const CalendarYearPlaceholder = () => {
  const { t } = useTranslate();

  return (
    <Box flex={1} align="center" justify="center" padding="lg" className="min-h-[320px]">
      <Text size="lg" weight="semibold" align="center">
        {t('calendar_year_view_in_progress_title')}
      </Text>
      <Text size="sm" color="foreground-muted" align="center" className="mt-2 leading-relaxed">
        {t('calendar_year_view_in_progress_description')}
      </Text>
    </Box>
  );
};
