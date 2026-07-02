import { useSignUp } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerCredentialsSchema, type RegisterCredentialsValues } from '@syna/shared-types';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';

import { AuthDivider } from '@/components/auth/AuthDivider';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { Button, FormField } from '@/components/ui';
import { AUTH_COPY } from '@/lib/auth/constants';
import { runAuthAction } from '@/lib/auth/runAuthAction';
import { ROUTES } from '@/lib/routes';
import { toast } from '@/lib/sonner';

export type RegisterCredentialsStepProps = {
  onVerificationRequired: () => void;
};

export const RegisterCredentialsStep = ({
  onVerificationRequired,
}: RegisterCredentialsStepProps) => {
  const router = useRouter();
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

      if (signUp.createdSessionId) {
        await signUp.finalize();
        router.replace(ROUTES.home);
        return;
      }

      await signUp.verifications.sendEmailCode();
      onVerificationRequired();
      toast(AUTH_COPY.registrationVerifyPrompt);
    });
  });

  return (
    <>
      <FormField
        control={control}
        name="email"
        label="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <FormField control={control} name="password" label="Password" secureTextEntry />
      <Button fullWidth loading={formState.isSubmitting} onPress={onRegister}>
        Register
      </Button>
      <AuthDivider />
      <SocialAuthButtons />
    </>
  );
};
