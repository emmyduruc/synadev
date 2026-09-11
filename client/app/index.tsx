import { Redirect } from 'expo-router';

import { MascotLoadingGate } from '@/components/loading/MascotLoadingGate';
import { Box } from '@/components/ui/Box';
import { useColdStartDestination } from '@/hooks/useColdStartDestination';
import { LOADING_VARIANT } from '@/lib/loading/loadingVariants';
import { ROUTES } from '@/lib/routes';

const IndexScreen = () => {
  const destination = useColdStartDestination();

  // Signed-out: go straight to welcome. No "getting your data ready" mascot.
  if (destination === ROUTES.welcome) {
    return <Redirect href={destination} />;
  }

  return (
    <MascotLoadingGate
      variant={LOADING_VARIANT.coldStart}
      isReady={destination !== null}
      className="relative flex-1 bg-background"
    >
      {destination ? <Redirect href={destination} /> : <Box flex={1} className="bg-background" />}
    </MascotLoadingGate>
  );
};

export default IndexScreen;
