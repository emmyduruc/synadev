import { useState } from 'react';

import { AuthGlassCard } from '@/components/auth/AuthGlassCard';
import { AuthGradientLayout } from '@/components/auth/AuthGradientLayout';
import { AuthHero } from '@/components/auth/AuthHero';
import { RegisterCredentialsStep } from '@/components/auth/RegisterCredentialsStep';
import { RegisterVerificationStep } from '@/components/auth/RegisterVerificationStep';
import { useTranslate } from '@/hooks/useTranslate';
import { ROUTES } from '@/lib/routes';

const RegisterScreen = () => {
  const { t } = useTranslate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  if (isVerifying) {
    return <RegisterVerificationStep identifier={verificationEmail} />;
  }

  return (
    <AuthGradientLayout header={{ title: '', fallbackHref: ROUTES.welcome }}>
      <AuthHero
        align="left"
        headline={t('register_headline')}
        bodyLines={[t('register_body_primary'), t('register_body_secondary')]}
      />

      <AuthGlassCard>
        <RegisterCredentialsStep
          onVerificationRequired={(email) => {
            setVerificationEmail(email);
            setIsVerifying(true);
          }}
        />
      </AuthGlassCard>
    </AuthGradientLayout>
  );
};

export default RegisterScreen;
