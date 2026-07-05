import { useSignIn } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, type LoginFormValues } from '@syna/shared-types';
import { Link, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';

import { AuthDivider } from '@/components/auth/AuthDivider';
import { AuthGlassCard } from '@/components/auth/AuthGlassCard';
import { AuthGradientLayout } from '@/components/auth/AuthGradientLayout';
import { AuthHero } from '@/components/auth/AuthHero';
import { AuthPrivacyNote } from '@/components/auth/AuthPrivacyNote';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { Box, Button, FormField, Text, TouchableOpacity } from '@/components/ui';
import { useTranslate } from '@/hooks/useTranslate';
import { runAuthAction } from '@/lib/auth/runAuthAction';
import { ROUTES } from '@/lib/routes';

const LoginScreen = () => {
  const router = useRouter();
  const { t } = useTranslate();
  const { signIn } = useSignIn();
  const { control, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const onLogin = handleSubmit(async ({ email, password }) => {
    await runAuthAction(async () => {
      const { error } = await signIn.password({ identifier: email, password });

      if (error) {
        throw error;
      }

      if (signIn.createdSessionId) {
        await signIn.finalize();
        router.replace(ROUTES.home);
      }
    });
  });

  return (
    <AuthGradientLayout header={{ title: t('login_title'), fallbackHref: ROUTES.welcome }}>
      <AuthHero headline={t('login_welcome_back')} subtitle={t('login_subtitle')} />

      <AuthGlassCard>
        <FormField
          control={control}
          name="email"
          label={t('login_email_label')}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <FormField
          control={control}
          name="password"
          label={t('login_password_label')}
          secureTextEntry
        />

        <Box direction="row" justify="center" align="center">
          <Text size="xs" color="foreground-muted">
            {t('login_forgot_prefix')}
          </Text>
          <Link href={ROUTES.forgotPassword} asChild>
            <TouchableOpacity className="mx-1">
              <Text size="xs" weight="semibold" color="primary" className="underline">
                {t('login_forgot_link')}
              </Text>
            </TouchableOpacity>
          </Link>
          <Text size="xs" color="foreground-muted">
            {t('login_forgot_suffix')}
          </Text>
        </Box>

        <Button fullWidth size="lg" loading={formState.isSubmitting} onPress={onLogin}>
          {t('login_submit_button')}
        </Button>

        <AuthPrivacyNote />
      </AuthGlassCard>

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
    </AuthGradientLayout>
  );
};

export default LoginScreen;
