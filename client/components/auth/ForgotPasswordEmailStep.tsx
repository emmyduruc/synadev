import { useSignIn } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordEmailSchema, type ForgotPasswordEmailValues } from '@syna/shared-types';
import { useForm } from 'react-hook-form';

import { Button, FormField } from '@/components/ui';
import { AUTH_COPY } from '@/lib/auth/constants';
import { runAuthAction } from '@/lib/auth/runAuthAction';
import { toast } from '@/lib/sonner';

export type ForgotPasswordEmailStepProps = {
  onCodeSent: () => void;
};

export const ForgotPasswordEmailStep = ({ onCodeSent }: ForgotPasswordEmailStepProps) => {
  const { signIn } = useSignIn();
  const { control, handleSubmit, formState } = useForm<ForgotPasswordEmailValues>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    defaultValues: { email: '' },
  });

  const onSendCode = handleSubmit(async ({ email }) => {
    await runAuthAction(async () => {
      const signInResult = await signIn.create({ identifier: email });

      if (signInResult.error) {
        throw signInResult.error;
      }

      const codeResult = await signIn.resetPasswordEmailCode.sendCode();

      if (codeResult.error) {
        throw codeResult.error;
      }

      onCodeSent();
      toast(AUTH_COPY.resetVerifyPrompt);
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
      <Button fullWidth loading={formState.isSubmitting} onPress={onSendCode}>
        Send reset code
      </Button>
    </>
  );
};
