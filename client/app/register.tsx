import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable } from 'react-native';

import { RegisterCredentialsStep } from '@/components/auth/RegisterCredentialsStep';
import { RegisterVerificationStep } from '@/components/auth/RegisterVerificationStep';
import { AppHeader, Box, Text } from '@/components/ui';
import { ROUTES } from '@/lib/routes';

const RegisterScreen = () => {
  const [isVerifying, setIsVerifying] = useState(false);

  return (
    <Box flex={1} background="background">
      <AppHeader title="Create account" showBack={false} />
      <Box flex={1} justify="center" padding="lg" gap="md" className="mx-auto w-full max-w-md">
        <Text size="3xl" weight="bold" align="center">
          Join SYNA
        </Text>
        <Text size="sm" color="foreground-muted" align="center">
          Create your account to continue.
        </Text>

        {isVerifying ? (
          <RegisterVerificationStep />
        ) : (
          <RegisterCredentialsStep onVerificationRequired={() => setIsVerifying(true)} />
        )}

        <Box direction="row" justify="center" align="center">
          <Text size="xs" color="foreground-muted">
            Already have an account?
          </Text>
          <Link href={ROUTES.login} asChild>
            <Pressable className="ml-1">
              <Text size="xs" weight="semibold" color="secondary" className="underline">
                Login
              </Text>
            </Pressable>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterScreen;
