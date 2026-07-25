import type { User } from '@syna/shared-types';
import { useCallback, useEffect, useState } from 'react';

import { getCurrentUser, toApiClientError, type ApiClientError } from '@/lib/api';

type UseCurrentUserState = {
  user: User | null;
  isLoading: boolean;
  error: ApiClientError | null;
  refetch: () => Promise<User | null>;
};

export const useCurrentUser = (): UseCurrentUserState => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiClientError | null>(null);

  const refetch = useCallback(async (): Promise<User | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getCurrentUser();
      setUser(data);
      return data;
    } catch (caught) {
      setError(toApiClientError(caught));
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { user, isLoading, error, refetch };
};
