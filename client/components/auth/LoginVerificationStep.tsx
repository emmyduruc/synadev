import { useSignIn } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerVerificationSchema, type RegisterVerificationValues } from '@syna/shared-types';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';

import { Box, Button, FormField, Text, TouchableOpacity } from '@/components/ui';
import { useTranslate } from '@/hooks/useTranslate';
import { completeAuthSession } from '@/lib/auth/completeAuthSession';
import { runAuthAction } from '@/lib/auth/runAuthAction';
import { sendLoginVerificationCode } from '@/lib/auth/sendLoginVerificationCode';

export type LoginVerificationStepProps = {
  onStartOver: () => void;
};

export const LoginVerificationStep = ({ onStartOver }: LoginVerificationStepProps) => {
  const router = useRouter();
  const { t } = useTranslate();
  const { signIn } = useSignIn();
  const { control, handleSubmit, formState } = useForm<RegisterVerificationValues>({
    resolver: zodResolver(registerVerificationSchema),
    defaultValues: { code: '' },
  });

  const onVerify = handleSubmit(async ({ code }) => {
    await runAuthAction(async () => {
      const { error } = await signIn.mfa.verifyEmailCode({ code });

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

      throw new Error(t('login_error_incomplete'));
    });
  });

  const onResendCode = async () => {
    await runAuthAction(async () => {
      await sendLoginVerificationCode(signIn);
    });
  };

  const handleStartOver = async () => {
    await signIn.reset();
    onStartOver();
  };

  return (
    <>
      <Text size="sm" color="foreground-muted" align="center" className="leading-relaxed">
        {t('login_verification_prompt')}
      </Text>
      <FormField
        control={control}
        name="code"
        label={t('login_verification_code_label')}
        keyboardType="number-pad"
      />
      <Button fullWidth size="lg" loading={formState.isSubmitting} onPress={onVerify}>
        {t('login_verify_button')}
      </Button>
      <Box direction="row" justify="center" align="center" gap="md">
        <TouchableOpacity onPress={onResendCode}>
          <Text size="xs" weight="semibold" color="primary" className="underline">
            {t('login_resend_code_button')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleStartOver}>
          <Text size="xs" weight="semibold" color="foreground-muted" className="underline">
            {t('login_start_over_button')}
          </Text>
        </TouchableOpacity>
      </Box>
    </>
  );
};
