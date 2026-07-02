import { useSignUp } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerVerificationSchema, type RegisterVerificationValues } from '@syna/shared-types';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';

import { Button, FormField, Text } from '@/components/ui';
import { AUTH_COPY } from '@/lib/auth/constants';
import { runAuthAction } from '@/lib/auth/runAuthAction';
import { ROUTES } from '@/lib/routes';

export const RegisterVerificationStep = () => {
  const router = useRouter();
  const { signUp } = useSignUp();
  const { control, handleSubmit, formState } = useForm<RegisterVerificationValues>({
    resolver: zodResolver(registerVerificationSchema),
    defaultValues: { code: '' },
  });

  const onVerify = handleSubmit(async ({ code }) => {
    await runAuthAction(async () => {
      const { error } = await signUp.verifications.verifyEmailCode({ code });

      if (error) {
        throw error;
      }

      if (signUp.createdSessionId) {
        await signUp.finalize();
        router.replace(ROUTES.home);
      }
    });
  });

  return (
    <>
      <Text size="sm" color="foreground-muted" align="center">
        {AUTH_COPY.registrationVerifyPrompt}
      </Text>
      <FormField control={control} name="code" label="Verification code" />
      <Button fullWidth loading={formState.isSubmitting} onPress={onVerify}>
        Verify email
      </Button>
    </>
  );
};
