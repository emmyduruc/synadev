import type { Href } from 'expo-router';
import { useState } from 'react';

import { AuthVerificationLayout } from '@/components/auth/AuthVerificationLayout';
import { Box, Button, Text, TouchableOpacity } from '@/components/ui';
import { OtpCodeInput, OTP_CODE_LENGTH } from '@/components/ui/OtpCodeInput';
import { OtpNumericKeypad } from '@/components/ui/OtpNumericKeypad';
import { useTranslate } from '@/hooks/useTranslate';

export type VerificationCodeStepProps = {
  identifier: string;
  fallbackHref: Href;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  onStartOver?: () => void;
  isSubmitting?: boolean;
};

export const VerificationCodeStep = ({
  identifier,
  fallbackHref,
  onVerify,
  onResend,
  onStartOver,
  isSubmitting = false,
}: VerificationCodeStepProps) => {
  const { t } = useTranslate();
  const [code, setCode] = useState('');

  const handleDigitPress = (digit: string) => {
    if (code.length >= OTP_CODE_LENGTH || isSubmitting) {
      return;
    }

    setCode((previous) => `${previous}${digit}`.slice(0, OTP_CODE_LENGTH));
  };

  const handleBackspacePress = () => {
    setCode((previous) => previous.slice(0, -1));
  };

  const handleVerify = async () => {
    if (code.length !== OTP_CODE_LENGTH || isSubmitting) {
      return;
    }

    await onVerify(code);
  };

  return (
    <AuthVerificationLayout
      title={t('verification_code_title')}
      subtitle={identifier}
      fallbackHref={fallbackHref}
      footer={
        <>
          <Button
            fullWidth
            size="lg"
            loading={isSubmitting}
            disabled={code.length !== OTP_CODE_LENGTH}
            onPress={() => {
              void handleVerify();
            }}>
            {t('wizard_next_button')}
          </Button>
          <OtpNumericKeypad
            disabled={isSubmitting}
            onDigitPress={handleDigitPress}
            onBackspacePress={handleBackspacePress}
          />
        </>
      }>
      <Box gap="md">
        <OtpCodeInput
          value={code}
          onChange={setCode}
          onComplete={(completedCode) => {
            void onVerify(completedCode);
          }}
        />

        <Box gap="xs">
          <Text size="sm" color="foreground-muted">
            {t('verification_code_resend_prompt')}
          </Text>
          <TouchableOpacity
            disabled={isSubmitting}
            onPress={() => {
              void onResend();
            }}>
            <Text size="sm" weight="semibold" color="primary">
              {t('login_resend_code_button')}
            </Text>
          </TouchableOpacity>
        </Box>

        {onStartOver ? (
          <TouchableOpacity
            disabled={isSubmitting}
            onPress={onStartOver}>
            <Text size="xs" weight="semibold" color="foreground-muted" className="underline">
              {t('login_start_over_button')}
            </Text>
          </TouchableOpacity>
        ) : null}
      </Box>
    </AuthVerificationLayout>
  );
};
