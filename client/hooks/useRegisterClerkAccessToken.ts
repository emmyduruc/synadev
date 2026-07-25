import { useAuth } from '@clerk/expo';
import { useEffect } from 'react';

import { setAccessTokenGetter } from '@/lib/http/authToken';

/**
 * Bridges Clerk session tokens into the Axios request interceptor.
 * Call from a component that mounts inside ClerkProvider.
 */
export const useRegisterClerkAccessToken = (): void => {
  const { getToken } = useAuth({ treatPendingAsSignedOut: false });

  useEffect(() => {
    setAccessTokenGetter(() => getToken());

    return () => {
      setAccessTokenGetter(null);
    };
  }, [getToken]);
};
