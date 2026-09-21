import { useSignUp } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerCredentialsSchema, type RegisterCredentialsValues } from '@syna/shared-types';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { AuthDivider } from '@/components/auth/AuthDivider';
import { SocialProviderIcon } from '@/components/auth/SocialProviderIcon';
import { Button, FormField, TouchableOpacity } from '@/components/ui';
import { EyeIcon } from '@/components/ui/icons/EyeIcon';
import { MailIcon } from '@/components/ui/icons/MailIcon';
import { useSocialAuth } from '@/hooks/useSocialAuth';
import { useTranslate } from '@/hooks/useTranslate';
import { completeAuthSession } from '@/lib/auth/completeAuthSession';
import { AUTH_PROVIDER } from '@/lib/auth/constants';
import { runAuthAction } from '@/lib/auth/runAuthAction';
import { toast } from '@/lib/sonner';
import { semanticColors } from '@/lib/ui';

export type RegisterCredentialsStepProps = {
  onVerificationRequired: (email: string) => void;
};

export const RegisterCredentialsStep = ({
  onVerificationRequired,
}: RegisterCredentialsStepProps) => {
  const router = useRouter();
  const { t } = useTranslate();
  const { signUp } = useSignUp();
  const { handleGoogleAuth, isSocialLoading } = useSocialAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailFocusKey, setEmailFocusKey] = useState(0);
  const { control, handleSubmit, formState } = useForm<RegisterCredentialsValues>({
    resolver: zodResolver(registerCredentialsSchema),
    defaultValues: { email: '', password: '' },
  });

  const softButtonStyle = { backgroundColor: semanticColors.report.dataBackground };

  const onRegister = handleSubmit(async ({ email, password }) => {
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
  });

  return (
    <>
      <Button
        variant="outline"
        fullWidth
        size="lg"
        disabled={isSocialLoading}
        leftIcon={<SocialProviderIcon provider={AUTH_PROVIDER.google} />}
        onPress={handleGoogleAuth}
        style={softButtonStyle}
        className="border-0"
        textClassName="text-foreground"
      >
        {t('auth_continue_with_google')}
      </Button>

      <Button
        variant="outline"
        fullWidth
        size="lg"
        disabled={isSocialLoading || formState.isSubmitting}
        leftIcon={<MailIcon />}
        onPress={() => setEmailFocusKey((current) => current + 1)}
        style={softButtonStyle}
        className="border-0"
        textClassName="text-foreground"
      >
        {t('auth_continue_via_email')}
      </Button>

      <AuthDivider />

      <FormField
        control={control}
        name="email"
        label={t('register_email_label')}
        placeholder={t('register_email_placeholder')}
        keyboardType="email-address"
        autoCapitalize="none"
        autoFocus={emailFocusKey > 0}
        focusKey={emailFocusKey}
      />
      <FormField
        control={control}
        name="password"
        label={t('register_password_label')}
        placeholder={t('register_password_placeholder')}
        secureTextEntry={!isPasswordVisible}
        helperText={t('register_password_hint')}
        rightIcon={(
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t(
              isPasswordVisible
                ? 'register_hide_password_accessibility'
                : 'register_show_password_accessibility',
            )}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            onPress={() => setIsPasswordVisible((visible) => !visible)}
          >
            <EyeIcon crossed={isPasswordVisible} color={semanticColors.foregroundMuted} />
          </TouchableOpacity>
        )}
      />
      <Button fullWidth size="lg" loading={formState.isSubmitting} onPress={onRegister}>
        {t('register_submit_button')}
      </Button>
    </>
  );
};
