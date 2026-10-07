import {
  createEmptyUserAppointment,
  type UpdateUserAppointment,
  type UserAppointment,
} from '@syna/shared-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import {
  deleteUserAppointment,
  getUserAppointment,
  putUserAppointment,
} from '@/lib/api';
import { queryKeys } from '@/lib/query/queryKeys';

/** Stable empty fallback — never recreate per render. */
const EMPTY_USER_APPOINTMENT = createEmptyUserAppointment();

export const useUserAppointment = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.appointments.me(),
    queryFn: (): Promise<UserAppointment> => getUserAppointment(),
  });

  const saveMutation = useMutation({
    mutationFn: (input: UpdateUserAppointment) => putUserAppointment(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.appointments.me() });
      const previous = queryClient.getQueryData<UserAppointment>(
        queryKeys.appointments.me(),
      );
      queryClient.setQueryData(queryKeys.appointments.me(), input);
      return { previous };
    },
    onError: (_error, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.appointments.me(), context.previous);
      }
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(queryKeys.appointments.me(), saved);
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => deleteUserAppointment(),
    onSuccess: (saved) => {
      queryClient.setQueryData(queryKeys.appointments.me(), saved);
    },
  });

  const appointment = query.data ?? EMPTY_USER_APPOINTMENT;

  const saveAppointment = useCallback(
    async (next: UpdateUserAppointment) => saveMutation.mutateAsync(next),
    [saveMutation],
  );

  const clearAppointment = useCallback(
    async () => clearMutation.mutateAsync(),
    [clearMutation],
  );

  return {
    appointment,
    isLoading: query.isLoading,
    isSaving: saveMutation.isPending || clearMutation.isPending,
    saveAppointment,
    clearAppointment,
    refetch: query.refetch,
  };
};
