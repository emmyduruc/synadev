import type { User } from '@syna/shared-types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getCurrentUser, toApiClientError, type ApiClientError } from '@/lib/api';
import { queryKeys } from '@/lib/query/queryKeys';

type UseCurrentUserState = {
  user: User | null;
  isLoading: boolean;
  error: ApiClientError | null;
  refetch: () => Promise<User | null>;
};

export const useCurrentUser = (): UseCurrentUserState => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.users.me(),
    queryFn: (): Promise<User> => getCurrentUser(),
  });

  const refetch = useCallback(async (): Promise<User | null> => {
    try {
      const result = await queryClient.fetchQuery({
        queryKey: queryKeys.users.me(),
        queryFn: (): Promise<User> => getCurrentUser(),
      });
      return result;
    } catch {
      return null;
    }
  }, [queryClient]);

  const error: ApiClientError | null = query.error
    ? toApiClientError(query.error)
    : null;

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    error,
    refetch,
  };
};
