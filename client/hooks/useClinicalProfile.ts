import {
  createEmptyClinicalProfile,
  type ClinicalProfile,
  type UpdateClinicalProfile,
} from '@syna/shared-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getClinicalProfile, putClinicalProfile } from '@/lib/api';
import { queryKeys } from '@/lib/query/queryKeys';

/** Stable empty fallback — never recreate per render (avoids effect loops). */
const EMPTY_CLINICAL_PROFILE = createEmptyClinicalProfile();

export const useClinicalProfile = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.clinicalProfile.me(),
    queryFn: (): Promise<ClinicalProfile> => getClinicalProfile(),
  });

  const mutation = useMutation({
    mutationFn: (input: UpdateClinicalProfile) => putClinicalProfile(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.clinicalProfile.me(),
      });
      const previous = queryClient.getQueryData<ClinicalProfile>(
        queryKeys.clinicalProfile.me(),
      );
      queryClient.setQueryData(queryKeys.clinicalProfile.me(), input);
      return { previous };
    },
    onError: (_error, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.clinicalProfile.me(),
          context.previous,
        );
      }
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(queryKeys.clinicalProfile.me(), saved);
    },
  });

  const profile = query.data ?? EMPTY_CLINICAL_PROFILE;

  const saveProfile = useCallback(
    async (next: UpdateClinicalProfile) => mutation.mutateAsync(next),
    [mutation],
  );

  return {
    profile,
    dataUpdatedAt: query.dataUpdatedAt,
    isLoading: query.isLoading,
    isError: query.isError,
    isSaving: mutation.isPending,
    saveProfile,
    refetch: query.refetch,
  };
};
