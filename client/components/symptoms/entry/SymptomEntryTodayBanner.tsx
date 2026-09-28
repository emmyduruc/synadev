import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';

export const SymptomEntryTodayBanner = () => {
  const { t } = useTranslate();

  return (
    <Box className="-mx-6 bg-lavender-light px-6 py-2.5">
      <Text size="sm" weight="medium" color="primary">
        {t('symptom_entry_today_banner_title')}
      </Text>
    </Box>
  );
};
