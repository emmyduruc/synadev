import { Box, Text } from '@/components/ui';
import { useTranslate } from '@/hooks/useTranslate';

export const AuthDivider = () => {
  const { t } = useTranslate();

  return (
    <Box direction="row" align="center" className="w-full py-1">
      <Box flex={1} className="h-px bg-lavender" />
      <Text size="xs" color="foreground-muted" className="px-4">
        {t('auth_divider_or')}
      </Text>
      <Box flex={1} className="h-px bg-lavender" />
    </Box>
  );
};
