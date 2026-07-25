import { useAuth } from '@clerk/expo';
import { Redirect, type Href } from 'expo-router';
import { useEffect, useState } from 'react';

import { resolvePostAuthDestination } from '@/lib/auth/postAuthDestination';
import { ROUTES } from '@/lib/routes';

const IndexScreen = () => {
  const { isLoaded, isSignedIn } = useAuth({ treatPendingAsSignedOut: false });
  const [destination, setDestination] = useState<Href | null>(null);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      setDestination(ROUTES.welcome);
      return;
    }

    let isActive = true;

    const resolve = async () => {
      const next = await resolvePostAuthDestination();

      if (isActive) {
        setDestination(next);
      }
    };

    void resolve();

    return () => {
      isActive = false;
    };
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || destination === null) {
    return null;
  }

  return <Redirect href={destination} />;
};

export default IndexScreen;
