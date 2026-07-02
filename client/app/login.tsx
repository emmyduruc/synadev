import { useSignIn } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, type LoginFormValues } from '@syna/shared-types';
import { Link, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Pressable } from 'react-native';

import { AuthDivider } from '@/components/auth/AuthDivider';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { AppHeader, Box, Button, FormField, Text } from '@/components/ui';
import { runAuthAction } from '@/lib/auth/runAuthAction';
import { ROUTES } from '@/lib/routes';

const LoginScreen = () => {
  const router = useRouter();
  const { signIn } = useSignIn();
  const { control, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const onLogin = handleSubmit(async ({ email, password }) => {
    await runAuthAction(async () => {
      const { error } = await signIn.password({ identifier: email, password });

      if (error) {
        throw error;
      }

      if (signIn.createdSessionId) {
        await signIn.finalize();
        router.replace(ROUTES.home);
      }
    });
  });

  return (
    <Box flex={1} background="background">
      <AppHeader title="Login" />
      <Box flex={1} justify="center" padding="lg" gap="md" className="mx-auto w-full max-w-md">
        <Text size="3xl" weight="bold" align="center">
          Welcome back
        </Text>

        <FormField
          control={control}
          name="email"
          label="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <FormField control={control} name="password" label="Password" secureTextEntry />

        <Box direction="row" justify="center" align="center">
          <Text size="xs" color="foreground-muted">
            Forgot your
          </Text>
          <Link href={ROUTES.forgotPassword} asChild>
            <Pressable className="mx-1">
              <Text size="xs" weight="semibold" color="secondary" className="underline">
                password
              </Text>
            </Pressable>
          </Link>
          <Text size="xs" color="foreground-muted">
            ?
          </Text>
        </Box>

        <Button fullWidth loading={formState.isSubmitting} onPress={onLogin}>
          Login
        </Button>
        <AuthDivider />
        <SocialAuthButtons />

        <Box direction="row" justify="center" align="center">
          <Text size="xs" color="foreground-muted">
            New to SYNA?
          </Text>
          <Link href={ROUTES.register} asChild>
            <Pressable className="ml-1">
              <Text size="xs" weight="semibold" color="secondary" className="underline">
                Register
              </Text>
            </Pressable>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginScreen;
