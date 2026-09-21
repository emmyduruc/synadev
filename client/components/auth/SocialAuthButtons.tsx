import { SocialProviderIcon } from '@/components/auth/SocialProviderIcon';
import { Box, Button } from '@/components/ui';
import { useSocialAuth } from '@/hooks/useSocialAuth';
import { useTranslate } from '@/hooks/useTranslate';
import { AUTH_PROVIDER } from '@/lib/auth/constants';
import { semanticColors } from '@/lib/ui';

export type SocialAuthButtonsProps = {
  disabled?: boolean;
};

export const SocialAuthButtons = ({ disabled = false }: SocialAuthButtonsProps) => {
  const { t } = useTranslate();
  const { handleAppleAuth, handleGoogleAuth, isSocialLoading } = useSocialAuth();
  const softButtonStyle = { backgroundColor: semanticColors.report.dataBackground };
  const isDisabled = isSocialLoading || disabled;

  return (
    <Box gap="md">
      <Button
        variant="outline"
        fullWidth
        size="lg"
        disabled={isDisabled}
        leftIcon={<SocialProviderIcon provider={AUTH_PROVIDER.google} />}
        onPress={handleGoogleAuth}
        style={softButtonStyle}
        className="border-0"
        textClassName="text-foreground"
      >
        {t('auth_continue_with_google')}
      </Button>

      <Button
        variant="outline"
        fullWidth
        size="lg"
        disabled={isDisabled}
        leftIcon={<SocialProviderIcon provider={AUTH_PROVIDER.apple} />}
        onPress={handleAppleAuth}
        style={softButtonStyle}
        className="border-0"
        textClassName="text-foreground"
      >
        {t('auth_continue_with_apple')}
      </Button>
    </Box>
  );
};
