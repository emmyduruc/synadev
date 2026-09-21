import { AuthGradientLayout } from '@/components/auth/AuthGradientLayout';
import { AuthHero } from '@/components/auth/AuthHero';
import { RegisterCredentialsFields } from '@/components/auth/RegisterCredentialsFields';
import { Box, Button } from '@/components/ui';
import { useRegisterCredentials } from '@/hooks/useRegisterCredentials';
import { useTranslate } from '@/hooks/useTranslate';
import { AUTH_HEADLINE_FONT_SIZE_PX } from '@/lib/auth/constants';
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
      <AuthHero
        align="left"
        headline={t('register_headline')}
        headlineWeight="semibold"
        headlineFontSizePx={AUTH_HEADLINE_FONT_SIZE_PX}
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
