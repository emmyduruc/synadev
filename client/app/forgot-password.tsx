import { useState } from 'react';

import { ForgotPasswordEmailStep } from '@/components/auth/ForgotPasswordEmailStep';
import { ForgotPasswordResetStep } from '@/components/auth/ForgotPasswordResetStep';
import { AppHeader, Box, Text } from '@/components/ui';
import { AUTH_COPY } from '@/lib/auth/constants';
import { ROUTES } from '@/lib/routes';

const ForgotPasswordScreen = () => {
  const [isCodeSent, setIsCodeSent] = useState(false);

  return (
    <Box flex={1} background="background">
      <AppHeader title="Forgot password" fallbackHref={ROUTES.login} />
      <Box flex={1} justify="center" padding="lg" gap="md" className="mx-auto w-full max-w-md">
        <Text size="3xl" weight="bold" align="center">
          Reset password
        </Text>
        <Text size="sm" color="foreground-muted" align="center">
          {isCodeSent ? AUTH_COPY.resetVerifyPrompt : AUTH_COPY.resetEmailPrompt}
        </Text>

        {isCodeSent ? (
          <ForgotPasswordResetStep />
        ) : (
          <ForgotPasswordEmailStep onCodeSent={() => setIsCodeSent(true)} />
        )}
      </Box>
    </Box>
  );
};

export default ForgotPasswordScreen;
