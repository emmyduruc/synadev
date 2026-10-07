import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteCurrentUserAccount } from '@/lib/api';
import { clearLocalUserData } from '@/lib/auth/clearLocalUserData';

/**
 * Deletes the Syna account (API) and clears local caches.
 * Caller should also `signOut()` from Clerk after success.
 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteCurrentUserAccount,
    onSuccess: async () => {
      queryClient.clear();
      await clearLocalUserData();
    },
  });

  return {
    deleteAccount: mutation.mutateAsync,
    isDeleting: mutation.isPending,
  };
};
