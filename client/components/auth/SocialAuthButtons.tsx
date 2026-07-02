import { SocialProviderIcon } from '@/components/auth/SocialProviderIcon';
import { Box, Button } from '@/components/ui';
import { useSocialAuth } from '@/hooks/useSocialAuth';
import { AUTH_PROVIDER } from '@/lib/auth/constants';

export const SocialAuthButtons = () => {
  const { handleAppleAuth, handleGoogleAuth, isSocialLoading } = useSocialAuth();

  return (
    <Box gap="sm">
      <Button
        variant="outline"
        fullWidth
        disabled={isSocialLoading}
        leftIcon={<SocialProviderIcon provider={AUTH_PROVIDER.google} />}
        onPress={handleGoogleAuth}>
        Continue with Google
      </Button>

      <Button
        variant="outline"
        fullWidth
        disabled={isSocialLoading}
        leftIcon={<SocialProviderIcon provider={AUTH_PROVIDER.apple} />}
        onPress={handleAppleAuth}>
        Continue with Apple
      </Button>
    </Box>
  );
};
