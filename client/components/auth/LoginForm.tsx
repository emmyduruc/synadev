import { AuthGradientLayout } from '@/components/auth/AuthGradientLayout';
import { LoginCredentialsFields } from '@/components/auth/LoginCredentialsFields';
import { Box, Button, ScreenHero } from '@/components/ui';
import { useLoginCredentials } from '@/hooks/useLoginCredentials';
import { useTranslate } from '@/hooks/useTranslate';
import { ROUTES } from '@/lib/routes';

export type LoginFormProps = {
  onVerificationRequired: (email: string) => void;
};

export const LoginForm = ({ onVerificationRequired }: LoginFormProps) => {
  const { t } = useTranslate();
  const {
    control,
    isSubmitting,
    isPasswordVisible,
    submit,
    togglePasswordVisibility,
  } = useLoginCredentials({ onVerificationRequired });

  return (
    <AuthGradientLayout
      header={{ title: '', fallbackHref: ROUTES.welcome }}
      footer={(
        <Box paddingX="lg">
          <Button fullWidth size="lg" loading={isSubmitting} onPress={submit}>
            {t('login_submit_button')}
          </Button>
        </Box>
      )}
    >
      <ScreenHero
        headline={t('login_welcome_back')}
        bodyLines={[t('login_subtitle')]}
      />

      <LoginCredentialsFields
        control={control}
        isPasswordVisible={isPasswordVisible}
        isBusy={isSubmitting}
        onTogglePasswordVisibility={togglePasswordVisibility}
      />
    </AuthGradientLayout>
  );
};
