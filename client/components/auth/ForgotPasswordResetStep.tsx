import { useSignIn } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordResetSchema, type ForgotPasswordResetValues } from '@syna/shared-types';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';

import { Button, FormField } from '@/components/ui';
import { AUTH_COPY } from '@/lib/auth/constants';
import { runAuthAction } from '@/lib/auth/runAuthAction';
import { ROUTES } from '@/lib/routes';
import { toast } from '@/lib/sonner';

export const ForgotPasswordResetStep = () => {
  const router = useRouter();
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

      toast.success(AUTH_COPY.resetSuccess);
      await signIn.reset();
      router.replace(ROUTES.login);
    });
  });

  return (
    <>
      <FormField control={control} name="code" label="Code" />
      <FormField control={control} name="password" label="New password" secureTextEntry />
      <Button fullWidth loading={formState.isSubmitting} onPress={onResetPassword}>
        Reset password
      </Button>
    </>
  );
};
