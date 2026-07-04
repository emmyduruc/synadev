import { SocialProviderIcon } from '@/components/auth/SocialProviderIcon';
import { Box, Button } from '@/components/ui';
import { useSocialAuth } from '@/hooks/useSocialAuth';
import { useTranslate } from '@/hooks/useTranslate';
import { AUTH_PROVIDER } from '@/lib/auth/constants';

export const SocialAuthButtons = () => {
  const { t } = useTranslate();
  const { handleAppleAuth, handleGoogleAuth, isSocialLoading } = useSocialAuth();

  return (
    <Box gap="sm">
      <Button
        variant="outline"
        fullWidth
        size="lg"
        disabled={isSocialLoading}
        leftIcon={<SocialProviderIcon provider={AUTH_PROVIDER.google} />}
        onPress={handleGoogleAuth}>
        {t('auth_continue_with_google')}
      </Button>

      <Button
        variant="outline"
        fullWidth
        size="lg"
        disabled={isSocialLoading}
        leftIcon={<SocialProviderIcon provider={AUTH_PROVIDER.apple} />}
        onPress={handleAppleAuth}>
        {t('auth_continue_with_apple')}
      </Button>
    </Box>
  );
};
