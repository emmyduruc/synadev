import { useSignUp } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerVerificationSchema, type RegisterVerificationValues } from '@syna/shared-types';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';

import { Button, FormField, Text } from '@/components/ui';
import { useTranslate } from '@/hooks/useTranslate';
import { completeAuthSession } from '@/lib/auth/completeAuthSession';
import { runAuthAction } from '@/lib/auth/runAuthAction';

export const RegisterVerificationStep = () => {
  const router = useRouter();
  const { t } = useTranslate();
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

      if (signUp.status === 'complete') {
        await completeAuthSession(signUp, {
          router,
          successTitle: t('register_success_title'),
          successDescription: t('register_success_description'),
        });
      }
    });
  });

  return (
    <>
      <Text size="sm" color="foreground-muted" align="center">
        {t('register_verification_prompt')}
      </Text>
      <FormField control={control} name="code" label={t('register_verification_code_label')} />
      <Button fullWidth size="lg" loading={formState.isSubmitting} onPress={onVerify}>
        {t('register_verify_button')}
      </Button>
    </>
  );
};
