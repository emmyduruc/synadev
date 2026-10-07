import type { User, UserHealthRecord } from '@syna/shared-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { getCurrentUser, updateCurrentUserHealthRecord } from '@/lib/api';
import { resolveHealthRecord } from '@/lib/healthRecord/healthRecordHelpers';
import { queryKeys } from '@/lib/query/queryKeys';

export const useHealthRecord = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.users.me(),
    queryFn: (): Promise<User> => getCurrentUser(),
  });

  const record = useMemo(
    () => resolveHealthRecord(query.data?.healthRecord ?? null),
    [query.data?.healthRecord],
  );

  const mutation = useMutation({
    mutationFn: async (next: UserHealthRecord) => {
      const payload: UserHealthRecord = {
        ...next,
        syncedAt: new Date().toISOString(),
      };
      return updateCurrentUserHealthRecord(payload);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.users.me(), user);
    },
  });

  const refresh = useCallback(async () => {
    await query.refetch();
  }, [query]);

  const saveRecord = useCallback(
    async (next: UserHealthRecord) => {
      const user = await mutation.mutateAsync(next);
      return resolveHealthRecord(user.healthRecord);
    },
    [mutation],
  );

  return {
    record,
    isLoading: query.isLoading,
    isSaving: mutation.isPending,
    refresh,
    saveRecord,
  };
};
