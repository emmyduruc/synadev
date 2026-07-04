import { Link } from 'expo-router';

import { AuthGradientLayout } from '@/components/auth/AuthGradientLayout';
import { AuthPrivacyNote } from '@/components/auth/AuthPrivacyNote';
import { SynaWordmark } from '@/components/auth/SynaWordmark';
import { Box, Button, Text } from '@/components/ui';
import { useTranslate } from '@/hooks/useTranslate';
import { ROUTES } from '@/lib/routes';

const WelcomeScreen = () => {
  const { t } = useTranslate();

  return (
    <AuthGradientLayout scrollable={false}>
      <Box flex={1} justify="between" className="py-6">
        <Box flex={1} justify="center" align="center" className="px-2">
          <SynaWordmark />
          <Text size="3xl" weight="bold" align="center" className="mb-4 leading-tight">
            {t('welcome_headline')}
          </Text>
          <Text size="base" color="foreground-muted" align="center" className="leading-relaxed">
            {t('welcome_subtitle')}
          </Text>
        </Box>

        <Box gap="md" className="pb-4">
          <Link href={ROUTES.login} asChild>
            <Button fullWidth size="lg">
              {t('welcome_login_button')}
            </Button>
          </Link>

          <Link href={ROUTES.register} asChild>
            <Button fullWidth size="lg" variant="outline">
              {t('welcome_register_button')}
            </Button>
          </Link>

          <AuthPrivacyNote />
        </Box>
      </Box>
    </AuthGradientLayout>
  );
};

export default WelcomeScreen;
