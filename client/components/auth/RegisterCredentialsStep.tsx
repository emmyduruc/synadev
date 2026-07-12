import { useSignUp } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerCredentialsSchema, type RegisterCredentialsValues } from '@syna/shared-types';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';

import { AuthDivider } from '@/components/auth/AuthDivider';
import { AuthPrivacyNote } from '@/components/auth/AuthPrivacyNote';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { Button, FormField } from '@/components/ui';
import { useTranslate } from '@/hooks/useTranslate';
import { completeAuthSession } from '@/lib/auth/completeAuthSession';
import { runAuthAction } from '@/lib/auth/runAuthAction';
import { toast } from '@/lib/sonner';

export type RegisterCredentialsStepProps = {
  onVerificationRequired: (email: string) => void;
};

export const RegisterCredentialsStep = ({
  onVerificationRequired,
}: RegisterCredentialsStepProps) => {
  const router = useRouter();
  const { t } = useTranslate();
  const { signUp } = useSignUp();
  const { control, handleSubmit, formState } = useForm<RegisterCredentialsValues>({
    resolver: zodResolver(registerCredentialsSchema),
    defaultValues: { email: '', password: '' },
  });

  const onRegister = handleSubmit(async ({ email, password }) => {
    await runAuthAction(async () => {
      const { error } = await signUp.password({ emailAddress: email, password });

      if (error) {
        throw error;
      }

      if (signUp.status === 'complete') {
        await completeAuthSession(signUp, {
          router,
          successTitle: t('register_success_title'),
          successDescription: t('register_success_description'),
        });
        return;
      }

      await signUp.verifications.sendEmailCode();
      onVerificationRequired(email);
      toast(t('register_verification_prompt'));
    });
  });

  return (
    <>
      <FormField
        control={control}
        name="email"
        label={t('register_email_label')}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <FormField
        control={control}
        name="password"
        label={t('register_password_label')}
        secureTextEntry
      />
      <Button fullWidth size="lg" loading={formState.isSubmitting} onPress={onRegister}>
        {t('register_submit_button')}
      </Button>
      <AuthPrivacyNote />
      <AuthDivider />
      <SocialAuthButtons />
    </>
  );
};
