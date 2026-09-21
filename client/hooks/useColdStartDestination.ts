import { useAuth } from '@clerk/expo';
import type { Href } from 'expo-router';
import { useEffect, useState } from 'react';

import {
  resolveCachedPostAuthDestination,
  resolvePostAuthDestination,
} from '@/lib/auth/postAuthDestination';
import { getIntroCompleted } from '@/lib/intro/introStorage';
import { ROUTES } from '@/lib/routes';

/**
 * Resolves the first post-splash route with a cache-first path for returning users.
 * Never blocks on `/users/me` when SecureStore already has a complete bio.
 */
export const useColdStartDestination = (): Href | null => {
  const { isLoaded, isSignedIn } = useAuth({ treatPendingAsSignedOut: false });
  const [destination, setDestination] = useState<Href | null>(null);

  useEffect(() => {
    if (!isLoaded) {
      setDestination(null);
      return;
    }

    if (!isSignedIn) {
      let isActive = true;

      const resolveSignedOut = async () => {
        const introDone = await getIntroCompleted();

        if (!isActive) {
          return;
        }

        setDestination(introDone ? ROUTES.welcome : ROUTES.intro);
      };

      void resolveSignedOut();

      return () => {
        isActive = false;
      };
    }

    let isActive = true;

    const resolve = async () => {
      const cached = await resolveCachedPostAuthDestination();

      if (!isActive) {
        return;
      }

      if (cached) {
        setDestination(cached);
        return;
      }

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

  return destination;
};
