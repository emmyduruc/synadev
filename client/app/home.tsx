import { useAuth } from '@clerk/expo';
import { Redirect } from 'expo-router';

import { AppHeader, Box, Text } from '@/components/ui';
import { ROUTES } from '@/lib/routes';

const HomeScreen = () => {
  const { isLoaded, isSignedIn } = useAuth({ treatPendingAsSignedOut: false });

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href={ROUTES.register} />;
  }

  return (
    <Box flex={1} background="background">
      <AppHeader title="Home" showBack={false} />
      <Box flex={1} align="center" justify="center" padding="lg">
        <Text size="2xl" weight="bold" align="center">
          Welcome to SYNA
        </Text>
      </Box>
    </Box>
  );
};

export default HomeScreen;
