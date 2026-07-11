import { useSignIn } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, type LoginFormValues } from '@syna/shared-types';
import { Link, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';

import { AuthPrivacyNote } from '@/components/auth/AuthPrivacyNote';
import { Box, Button, FormField, Text, TouchableOpacity } from '@/components/ui';
import { useTranslate } from '@/hooks/useTranslate';
import { completeAuthSession } from '@/lib/auth/completeAuthSession';
import { runAuthAction } from '@/lib/auth/runAuthAction';
import { sendLoginVerificationCode } from '@/lib/auth/sendLoginVerificationCode';
import { ROUTES } from '@/lib/routes';

export type LoginCredentialsStepProps = {
  onVerificationRequired: () => void;
};

export const LoginCredentialsStep = ({ onVerificationRequired }: LoginCredentialsStepProps) => {
  const router = useRouter();
  const { t } = useTranslate();
  const { signIn } = useSignIn();
  const { control, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const onLogin = handleSubmit(async ({ email, password }) => {
    await runAuthAction(async () => {
      const { error } = await signIn.password({
        emailAddress: email,
        password,
      });

      if (error) {
        throw error;
      }

      if (signIn.status === 'complete') {
        await completeAuthSession(signIn, {
          router,
          successTitle: t('login_success_title'),
          successDescription: t('login_success_description'),
        });
        return;
      }

      if (
        signIn.status === 'needs_second_factor'
        || signIn.status === 'needs_client_trust'
      ) {
        await sendLoginVerificationCode(signIn);
        onVerificationRequired();
        return;
      }

      throw new Error(t('login_error_incomplete'));
    });
  });

  return (
    <>
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
    </>
  );
};
