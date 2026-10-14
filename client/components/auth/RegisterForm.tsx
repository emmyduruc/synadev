import { AuthGradientLayout } from '@/components/auth/AuthGradientLayout';
import { RegisterConsentSection } from '@/components/auth/RegisterConsentSection';
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
    acceptedPrivacy,
    wantsNewsletter,
    canSubmit,
    submit,
    focusEmailField,
    togglePasswordVisibility,
    togglePrivacy,
    toggleNewsletter,
  } = useRegisterCredentials({ onVerificationRequired });

  return (
    <AuthGradientLayout
      header={{ title: '', fallbackHref: ROUTES.welcome }}
      footer={(
        <Box paddingX="lg">
          <Button
            fullWidth
            size="lg"
            loading={isSubmitting}
            disabled={!canSubmit || isSubmitting}
            onPress={submit}
          >
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
        canContinue={canSubmit}
        onFocusEmail={focusEmailField}
        onTogglePasswordVisibility={togglePasswordVisibility}
      />

      <RegisterConsentSection
        acceptedPrivacy={acceptedPrivacy}
        wantsNewsletter={wantsNewsletter}
        onTogglePrivacy={togglePrivacy}
        onToggleNewsletter={toggleNewsletter}
      />
    </AuthGradientLayout>
  );
};
