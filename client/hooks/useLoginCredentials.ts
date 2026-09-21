import { useSignIn } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, type LoginFormValues } from '@syna/shared-types';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useTranslate } from '@/hooks/useTranslate';
import { completeAuthSession } from '@/lib/auth/completeAuthSession';
import {
  loadRememberedLoginEmail,
  saveRememberedLoginEmail,
} from '@/lib/auth/rememberedLoginEmailStorage';
import { runAuthAction } from '@/lib/auth/runAuthAction';
import { sendLoginVerificationCode } from '@/lib/auth/sendLoginVerificationCode';

export type UseLoginCredentialsOptions = {
  onVerificationRequired: (email: string) => void;
};

export const useLoginCredentials = ({
  onVerificationRequired,
}: UseLoginCredentialsOptions) => {
  const router = useRouter();
  const { t } = useTranslate();
  const { signIn } = useSignIn();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { control, handleSubmit, setValue, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    let isMounted = true;

    void loadRememberedLoginEmail().then((email) => {
      if (isMounted && email) {
        setValue('email', email);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [setValue]);

  const submit = useCallback(() => {
    void handleSubmit(async ({ email, password }) => {
      await runAuthAction(async () => {
        await saveRememberedLoginEmail(email);

        const { error } = await signIn.password({
          emailAddress: email,
          password,
        });

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

        if (
          signIn.status === 'needs_second_factor'
          || signIn.status === 'needs_client_trust'
        ) {
          await sendLoginVerificationCode(signIn);
          onVerificationRequired(email);
          return;
        }

        throw new Error(t('login_error_incomplete'));
      });
    })();
  }, [handleSubmit, onVerificationRequired, router, signIn, t]);

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((visible) => !visible);
  }, []);

  return {
    control,
    isSubmitting: formState.isSubmitting,
    isPasswordVisible,
    submit,
    togglePasswordVisibility,
  };
};
