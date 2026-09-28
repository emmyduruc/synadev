import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';

export const SymptomEntryNoticeBox = () => {
  const { t } = useTranslate();

  return (
    <Box className="rounded-2xl border border-border bg-muted/50 px-4 py-3" gap="xs">
      <Text size="xs" weight="semibold">
        {t('symptom_entry_notice_title')}
      </Text>
      <Text size="2xs" color="foreground-muted" className="leading-relaxed">
        {t('symptom_entry_notice_body')}
      </Text>
    </Box>
  );
};
