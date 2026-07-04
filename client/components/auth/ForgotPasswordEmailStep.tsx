import { useSignIn } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordEmailSchema, type ForgotPasswordEmailValues } from '@syna/shared-types';
import { useForm } from 'react-hook-form';

import { Button, FormField } from '@/components/ui';
import { useTranslate } from '@/hooks/useTranslate';
import { runAuthAction } from '@/lib/auth/runAuthAction';
import { toast } from '@/lib/sonner';

export type ForgotPasswordEmailStepProps = {
  onCodeSent: () => void;
};

export const ForgotPasswordEmailStep = ({ onCodeSent }: ForgotPasswordEmailStepProps) => {
  const { t } = useTranslate();
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
      toast(t('forgot_password_verify_prompt'));
    });
  });

  return (
    <>
      <FormField
        control={control}
        name="email"
        label={t('forgot_password_email_label')}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button fullWidth size="lg" loading={formState.isSubmitting} onPress={onSendCode}>
        {t('forgot_password_send_code_button')}
      </Button>
    </>
  );
};
