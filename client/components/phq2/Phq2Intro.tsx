import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';

export const Phq2Intro = () => {
  const { t } = useTranslate();

  return (
    <Box gap="md" paddingX="lg" className="pt-4">
      <Text size="2xl" weight="bold" align="center">
        {t('phq2_intro_title')}
      </Text>
      <Text size="sm" color="foreground-muted" align="center" className="leading-6">
        {t('phq2_intro_body')}
      </Text>
      <Text size="xs" color="foreground-muted" align="center">
        {t('phq2_intro_privacy')}
      </Text>
    </Box>
  );
};
