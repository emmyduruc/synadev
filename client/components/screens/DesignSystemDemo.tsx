import { SymbolView } from 'expo-symbols';

import { DesignSystemActions } from '@/components/screens/DesignSystemActions';
import { Banner, Box, Text, TextInput } from '@/components/ui';
import { useDesignSystemDemo } from '@/hooks/useDesignSystemDemo';
import { semanticColors } from '@/lib/ui';

export const DesignSystemDemo = () => {
  const { email, setEmail, isLoading, inputError, handleSubmit, handleToast } =
    useDesignSystemDemo();

  return (
    <Box flex={1} background="background" padding="md" className="bg-neutral-50">
      <Box className="mx-auto w-full max-w-md" gap="md">
        <Text size="3xl" weight="bold" color="primary" responsive>
          SYNA
        </Text>
        <Text size="sm" color="foreground-muted" responsive>
          Reusable design system components with responsive scaling.
        </Text>

        <Banner
          title="Design system ready"
          description="Text, Box, TextInput, Button, Banner, and Sonner toasts are wired up."
          variant="info"
          size="md"
        />

        <TextInput
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          errorMessage={inputError}
          helperText="We will never share your email."
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={
            <SymbolView
              name={{ ios: 'envelope', android: 'mail', web: 'mail' }}
              size={18}
              tintColor={semanticColors.foregroundMuted}
            />
          }
        />

        <DesignSystemActions
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onToast={handleToast}
        />
      </Box>
    </Box>
  );
};
