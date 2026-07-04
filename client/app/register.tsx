import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable } from 'react-native';

import { AuthGlassCard } from '@/components/auth/AuthGlassCard';
import { AuthGradientLayout } from '@/components/auth/AuthGradientLayout';
import { AuthHero } from '@/components/auth/AuthHero';
import { RegisterCredentialsStep } from '@/components/auth/RegisterCredentialsStep';
import { RegisterVerificationStep } from '@/components/auth/RegisterVerificationStep';
import { Box, Text } from '@/components/ui';
import { useTranslate } from '@/hooks/useTranslate';
import { ROUTES } from '@/lib/routes';

const RegisterScreen = () => {
  const { t } = useTranslate();
  const [isVerifying, setIsVerifying] = useState(false);

  return (
    <AuthGradientLayout header={{ title: t('register_title'), fallbackHref: ROUTES.welcome }}>
      <AuthHero headline={t('register_headline')} subtitle={t('register_subtitle')} />

      <AuthGlassCard>
        {isVerifying ? (
          <RegisterVerificationStep />
        ) : (
          <RegisterCredentialsStep onVerificationRequired={() => setIsVerifying(true)} />
        )}
      </AuthGlassCard>

      <Box direction="row" justify="center" align="center" className="mt-6">
        <Text size="sm" color="foreground-muted">
          {t('register_has_account')}{' '}
        </Text>
        <Link href={ROUTES.login} asChild>
          <Pressable>
            <Text size="sm" weight="semibold" color="primary" className="underline">
              {t('register_login_link')}
            </Text>
          </Pressable>
        </Link>
      </Box>
    </AuthGradientLayout>
  );
};

export default RegisterScreen;
