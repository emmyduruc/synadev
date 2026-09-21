import type { LoginFormValues } from '@syna/shared-types';
import { Link } from 'expo-router';
import type { Control } from 'react-hook-form';

import { AuthDivider } from '@/components/auth/AuthDivider';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { Box, FormField, Text, TouchableOpacity } from '@/components/ui';
import { EyeIcon } from '@/components/ui/icons/EyeIcon';
import { useTranslate } from '@/hooks/useTranslate';
import { ROUTES } from '@/lib/routes';
import { semanticColors } from '@/lib/ui';

export type LoginCredentialsFieldsProps = {
  control: Control<LoginFormValues>;
  isPasswordVisible: boolean;
  isBusy: boolean;
  onTogglePasswordVisibility: () => void;
};

export const LoginCredentialsFields = ({
  control,
  isPasswordVisible,
  isBusy,
  onTogglePasswordVisibility,
}: LoginCredentialsFieldsProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="md">
      <SocialAuthButtons disabled={isBusy} />

      <AuthDivider />

      <FormField
        control={control}
        name="email"
        label={t('login_email_label')}
        placeholder={t('login_email_placeholder')}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
      />
      <FormField
        control={control}
        name="password"
        label={t('login_password_label')}
        placeholder={t('login_password_placeholder')}
        secureTextEntry={!isPasswordVisible}
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

      <Box direction="row" justify="center" align="center">
        <Text size="xs" color="foreground-muted">
          {t('login_forgot_prefix')}
        </Text>
        <Link href={ROUTES.forgotPassword} asChild>
          <TouchableOpacity className="mx-1">
            <Text size="xs" weight="semibold" color="primary" className="underline">
              {t('login_forgot_link')}
            </Text>
          </TouchableOpacity>
        </Link>
        <Text size="xs" color="foreground-muted">
          {t('login_forgot_suffix')}
        </Text>
      </Box>

      <Box direction="row" justify="center" align="center" className="mt-2">
        <Text size="sm" color="foreground-muted">
          {t('login_new_to_syna')}{' '}
        </Text>
        <Link href={ROUTES.register} asChild>
          <TouchableOpacity>
            <Text size="sm" weight="semibold" color="primary" className="underline">
              {t('login_register_link')}
            </Text>
          </TouchableOpacity>
        </Link>
      </Box>
    </Box>
  );
};
