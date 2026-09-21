import { useSignUp } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerCredentialsSchema, type RegisterCredentialsValues } from '@syna/shared-types';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useTranslate } from '@/hooks/useTranslate';
import { completeAuthSession } from '@/lib/auth/completeAuthSession';
import { runAuthAction } from '@/lib/auth/runAuthAction';
import { toast } from '@/lib/sonner';

export type UseRegisterCredentialsOptions = {
  onVerificationRequired: (email: string) => void;
};

export const useRegisterCredentials = ({
  onVerificationRequired,
}: UseRegisterCredentialsOptions) => {
  const router = useRouter();
  const { t } = useTranslate();
  const { signUp } = useSignUp();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailFocusKey, setEmailFocusKey] = useState(0);
  const { control, handleSubmit, formState } = useForm<RegisterCredentialsValues>({
    resolver: zodResolver(registerCredentialsSchema),
    defaultValues: { email: '', password: '' },
  });

  const submit = useCallback(() => {
    void handleSubmit(async ({ email, password }) => {
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
    })();
  }, [handleSubmit, onVerificationRequired, router, signUp, t]);

  const focusEmailField = useCallback(() => {
    setEmailFocusKey((current) => current + 1);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((visible) => !visible);
  }, []);

  return {
    control,
    isSubmitting: formState.isSubmitting,
    isPasswordVisible,
    emailFocusKey,
    submit,
    focusEmailField,
    togglePasswordVisibility,
  };
};
