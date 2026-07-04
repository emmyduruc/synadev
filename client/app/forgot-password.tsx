import { useState } from 'react';

import { AuthGlassCard } from '@/components/auth/AuthGlassCard';
import { AuthGradientLayout } from '@/components/auth/AuthGradientLayout';
import { AuthHero } from '@/components/auth/AuthHero';
import { ForgotPasswordEmailStep } from '@/components/auth/ForgotPasswordEmailStep';
import { ForgotPasswordResetStep } from '@/components/auth/ForgotPasswordResetStep';
import { useTranslate } from '@/hooks/useTranslate';
import { ROUTES } from '@/lib/routes';

const ForgotPasswordScreen = () => {
  const { t } = useTranslate();
  const [isCodeSent, setIsCodeSent] = useState(false);

  return (
    <AuthGradientLayout header={{ title: t('forgot_password_title'), fallbackHref: ROUTES.login }}>
      <AuthHero
        headline={t('forgot_password_headline')}
        subtitle={
          isCodeSent ? t('forgot_password_verify_prompt') : t('forgot_password_email_prompt')
        }
      />

      <AuthGlassCard>
        {isCodeSent ? (
          <ForgotPasswordResetStep />
        ) : (
          <ForgotPasswordEmailStep onCodeSent={() => setIsCodeSent(true)} />
        )}
      </AuthGlassCard>
    </AuthGradientLayout>
  );
};

export default ForgotPasswordScreen;
