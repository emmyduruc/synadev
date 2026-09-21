import type { RegisterCredentialsValues } from '@syna/shared-types';
import type { Control } from 'react-hook-form';

import { AuthDivider } from '@/components/auth/AuthDivider';
import { SocialProviderIcon } from '@/components/auth/SocialProviderIcon';
import { Box, Button, FormField, TouchableOpacity } from '@/components/ui';
import { EyeIcon } from '@/components/ui/icons/EyeIcon';
import { MailIcon } from '@/components/ui/icons/MailIcon';
import { useSocialAuth } from '@/hooks/useSocialAuth';
import { useTranslate } from '@/hooks/useTranslate';
import { AUTH_PROVIDER } from '@/lib/auth/constants';
import { semanticColors } from '@/lib/ui';

export type RegisterCredentialsFieldsProps = {
  control: Control<RegisterCredentialsValues>;
  isPasswordVisible: boolean;
  emailFocusKey: number;
  isBusy: boolean;
  onFocusEmail: () => void;
  onTogglePasswordVisibility: () => void;
};

export const RegisterCredentialsFields = ({
  control,
  isPasswordVisible,
  emailFocusKey,
  isBusy,
  onFocusEmail,
  onTogglePasswordVisibility,
}: RegisterCredentialsFieldsProps) => {
  const { t } = useTranslate();
  const { handleGoogleAuth, isSocialLoading } = useSocialAuth();
  const softButtonStyle = { backgroundColor: semanticColors.report.dataBackground };

  return (
    <Box gap="md">
      <Button
        variant="outline"
        fullWidth
        size="lg"
        disabled={isSocialLoading || isBusy}
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
        disabled={isSocialLoading || isBusy}
        leftIcon={<MailIcon />}
        onPress={onFocusEmail}
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
            onPress={onTogglePasswordVisibility}
          >
            <EyeIcon crossed={isPasswordVisible} color={semanticColors.foregroundMuted} />
          </TouchableOpacity>
        )}
      />
    </Box>
  );
};
