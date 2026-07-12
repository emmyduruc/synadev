import { useSignIn } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { VerificationCodeStep } from '@/components/auth/VerificationCodeStep';
import { useTranslate } from '@/hooks/useTranslate';
import { completeAuthSession } from '@/lib/auth/completeAuthSession';
import { runAuthAction } from '@/lib/auth/runAuthAction';
import { sendLoginVerificationCode } from '@/lib/auth/sendLoginVerificationCode';
import { ROUTES } from '@/lib/routes';

export type LoginVerificationStepProps = {
  identifier: string;
  onStartOver: () => void;
};

export const LoginVerificationStep = ({
  identifier,
  onStartOver,
}: LoginVerificationStepProps) => {
  const router = useRouter();
  const { t } = useTranslate();
  const { signIn } = useSignIn();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onVerify = async (code: string) => {
    await runAuthAction(async () => {
      setIsSubmitting(true);

      try {
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
      } finally {
        setIsSubmitting(false);
      }
    });
  };

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
    <VerificationCodeStep
      identifier={identifier}
      fallbackHref={ROUTES.login}
      onVerify={onVerify}
      onResend={onResendCode}
      onStartOver={handleStartOver}
      isSubmitting={isSubmitting}
    />
  );
};
