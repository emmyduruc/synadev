import { AuthGradientLayout } from '@/components/auth/AuthGradientLayout';
import { RegisterCredentialsFields } from '@/components/auth/RegisterCredentialsFields';
import { Box, Button, ScreenHero } from '@/components/ui';
import { useRegisterCredentials } from '@/hooks/useRegisterCredentials';
import { useTranslate } from '@/hooks/useTranslate';
import { ROUTES } from '@/lib/routes';

export type RegisterFormProps = {
  onVerificationRequired: (email: string) => void;
};

export const RegisterForm = ({ onVerificationRequired }: RegisterFormProps) => {
  const { t } = useTranslate();
  const {
    control,
    isSubmitting,
    isPasswordVisible,
    emailFocusKey,
    submit,
    focusEmailField,
    togglePasswordVisibility,
  } = useRegisterCredentials({ onVerificationRequired });

  return (
    <AuthGradientLayout
      header={{ title: '', fallbackHref: ROUTES.welcome }}
      footer={(
        <Box paddingX="lg">
          <Button fullWidth size="lg" loading={isSubmitting} onPress={submit}>
            {t('register_submit_button')}
          </Button>
        </Box>
      )}
    >
      <ScreenHero
        headline={t('register_headline')}
        bodyLines={[t('register_body_primary')]}
      />

      <RegisterCredentialsFields
        control={control}
        isPasswordVisible={isPasswordVisible}
        emailFocusKey={emailFocusKey}
        isBusy={isSubmitting}
        onFocusEmail={focusEmailField}
        onTogglePasswordVisibility={togglePasswordVisibility}
      />
    </AuthGradientLayout>
  );
};
