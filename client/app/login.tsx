import { Link } from 'expo-router';
import { useState } from 'react';

import { AuthDivider } from '@/components/auth/AuthDivider';
import { AuthGlassCard } from '@/components/auth/AuthGlassCard';
import { AuthGradientLayout } from '@/components/auth/AuthGradientLayout';
import { AuthHero } from '@/components/auth/AuthHero';
import { LoginCredentialsStep } from '@/components/auth/LoginCredentialsStep';
import { LoginVerificationStep } from '@/components/auth/LoginVerificationStep';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { Box, Text, TouchableOpacity } from '@/components/ui';
import { useTranslate } from '@/hooks/useTranslate';
import { ROUTES } from '@/lib/routes';

const LoginScreen = () => {
  const { t } = useTranslate();
  const [isVerifying, setIsVerifying] = useState(false);

  return (
    <AuthGradientLayout header={{ title: t('login_title'), fallbackHref: ROUTES.welcome }}>
      <AuthHero headline={t('login_welcome_back')} subtitle={t('login_subtitle')} />

      <AuthGlassCard>
        {isVerifying ? (
          <LoginVerificationStep onStartOver={() => setIsVerifying(false)} />
        ) : (
          <LoginCredentialsStep onVerificationRequired={() => setIsVerifying(true)} />
        )}
      </AuthGlassCard>

      {!isVerifying ? (
        <Box gap="md" className="mt-6">
          <AuthDivider />
          <SocialAuthButtons />

          <Box direction="row" justify="center" align="center" className="mt-2">
            <Text size="sm" color="foreground-muted">
              {t('login_new_to_syna')}{' '}
            </Text>
            <Link href={ROUTES.register} asChild>
              <TouchableOpacity>
                <Text size="sm" weight="semibold" color="primary" className="underline">
                  {t('login_register_link')}
                </Text>
              </TouchableOpacity>
            </Link>
          </Box>
        </Box>
      ) : null}
    </AuthGradientLayout>
  );
};

export default LoginScreen;
