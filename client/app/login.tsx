import { useSignIn } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, type LoginFormValues } from '@syna/shared-types';
import { Link, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Pressable } from 'react-native';

import { AuthDivider } from '@/components/auth/AuthDivider';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { AppHeader, Box, Button, FormField, Text } from '@/components/ui';
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
    <Box flex={1} background="background">
      <AppHeader title={t('login_title')} />
      <Box flex={1} justify="center" padding="lg" gap="md" className="mx-auto w-full max-w-md">
        <Text size="3xl" weight="bold" align="center">
          {t('login_welcome_back')}
        </Text>

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
            <Pressable className="mx-1">
              <Text size="xs" weight="semibold" color="secondary" className="underline">
                {t('login_forgot_link')}
              </Text>
            </Pressable>
          </Link>
          <Text size="xs" color="foreground-muted">
            {t('login_forgot_suffix')}
          </Text>
        </Box>

        <Button fullWidth loading={formState.isSubmitting} onPress={onLogin}>
          {t('login_submit_button')}
        </Button>
        <AuthDivider />
        <SocialAuthButtons />

        <Box direction="row" justify="center" align="center">
          <Text size="xs" color="foreground-muted">
            {t('login_new_to_syna')}
          </Text>
          <Link href={ROUTES.register} asChild>
            <Pressable className="ml-1">
              <Text size="xs" weight="semibold" color="secondary" className="underline">
                {t('login_register_link')}
              </Text>
            </Pressable>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginScreen;
