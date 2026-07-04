import { useSignIn } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordResetSchema, type ForgotPasswordResetValues } from '@syna/shared-types';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';

import { Button, FormField } from '@/components/ui';
import { useTranslate } from '@/hooks/useTranslate';
import { runAuthAction } from '@/lib/auth/runAuthAction';
import { ROUTES } from '@/lib/routes';
import { toast } from '@/lib/sonner';

export const ForgotPasswordResetStep = () => {
  const router = useRouter();
  const { t } = useTranslate();
  const { signIn } = useSignIn();
  const { control, handleSubmit, formState } = useForm<ForgotPasswordResetValues>({
    resolver: zodResolver(forgotPasswordResetSchema),
    defaultValues: { code: '', password: '' },
  });

  const onResetPassword = handleSubmit(async ({ code, password }) => {
    await runAuthAction(async () => {
      const verifyResult = await signIn.resetPasswordEmailCode.verifyCode({ code });

      if (verifyResult.error) {
        throw verifyResult.error;
      }

      const passwordResult = await signIn.resetPasswordEmailCode.submitPassword({ password });

      if (passwordResult.error) {
        throw passwordResult.error;
      }

      toast.success(t('auth_reset_success'));
      await signIn.reset();
      router.replace(ROUTES.login);
    });
  });

  return (
    <>
      <FormField control={control} name="code" label={t('forgot_password_code_label')} />
      <FormField
        control={control}
        name="password"
        label={t('forgot_password_new_password_label')}
        secureTextEntry
      />
      <Button fullWidth size="lg" loading={formState.isSubmitting} onPress={onResetPassword}>
        {t('forgot_password_reset_button')}
      </Button>
    </>
  );
};
