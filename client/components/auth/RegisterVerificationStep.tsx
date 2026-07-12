import { useSignUp } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { VerificationCodeStep } from '@/components/auth/VerificationCodeStep';
import { useTranslate } from '@/hooks/useTranslate';
import { completeAuthSession } from '@/lib/auth/completeAuthSession';
import { runAuthAction } from '@/lib/auth/runAuthAction';
import { ROUTES } from '@/lib/routes';

export type RegisterVerificationStepProps = {
  identifier: string;
};

export const RegisterVerificationStep = ({ identifier }: RegisterVerificationStepProps) => {
  const router = useRouter();
  const { t } = useTranslate();
  const { signUp } = useSignUp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onVerify = async (code: string) => {
    await runAuthAction(async () => {
      setIsSubmitting(true);

      try {
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
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  const onResendCode = async () => {
    await runAuthAction(async () => {
      await signUp.verifications.sendEmailCode();
    });
  };

  return (
    <VerificationCodeStep
      identifier={identifier}
      fallbackHref={ROUTES.register}
      onVerify={onVerify}
      onResend={onResendCode}
      isSubmitting={isSubmitting}
    />
  );
};
