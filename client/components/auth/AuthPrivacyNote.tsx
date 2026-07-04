import { Text } from '@/components/ui';
import { useTranslate } from '@/hooks/useTranslate';

export const AuthPrivacyNote = () => {
  const { t } = useTranslate();

  return (
    <Text size="2xs" color="foreground-muted" align="center" className="mt-2 leading-relaxed">
      {t('auth_privacy_note')}
    </Text>
  );
};
