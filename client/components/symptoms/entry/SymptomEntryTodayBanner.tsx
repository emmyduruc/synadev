import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { toDateKey } from '@/lib/date/dateKeys';

export type SymptomEntryTodayBannerProps = {
  selectedDateKey: string;
};

export const SymptomEntryTodayBanner = ({
  selectedDateKey,
}: SymptomEntryTodayBannerProps) => {
  const { t } = useTranslate();
  const isToday = selectedDateKey === toDateKey(new Date());

  return (
    <Box className="-mx-6 bg-lavender-light px-6 py-2.5">
      <Text size="sm" weight="medium" color="primary">
        {isToday
          ? t('symptom_entry_banner_today')
          : t('symptom_entry_banner_other_day')}
      </Text>
    </Box>
  );
};
