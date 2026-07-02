import type { User } from '@syna/shared-types';
import { useCallback, useEffect, useState } from 'react';


import { getUsers, toApiClientError, type ApiClientError } from '@/lib/api';

type UseUsersState = {
  users: User[];
  isLoading: boolean;
  error: ApiClientError | null;
  refetch: () => Promise<void>;
};

export const useUsers = (): UseUsersState => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiClientError | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getUsers();
      setUsers(data);
    } catch (caught) {
      setError(toApiClientError(caught));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { users, isLoading, error, refetch };
};
