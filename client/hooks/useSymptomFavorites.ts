import type { SymptomId } from '@syna/shared-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { getSymptomFavorites, replaceSymptomFavorites } from '@/lib/api';
import { queryKeys } from '@/lib/query/queryKeys';
import {
  loadFavoriteSymptomIds,
  saveFavoriteSymptomIds,
} from '@/lib/symptoms/symptomFavoritesStorage';

export const useSymptomFavorites = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.symptoms.favorites(),
    queryFn: async (): Promise<SymptomId[]> => {
      try {
        const { symptomIds } = await getSymptomFavorites();

        if (symptomIds.length > 0) {
          await saveFavoriteSymptomIds(symptomIds);
          return symptomIds;
        }

        const localIds = await loadFavoriteSymptomIds();

        if (localIds.length > 0) {
          const { symptomIds: saved } = await replaceSymptomFavorites({
            symptomIds: localIds,
          });
          await saveFavoriteSymptomIds(saved);
          return saved;
        }

        return [];
      } catch {
        return loadFavoriteSymptomIds();
      }
    },
  });

  const mutation = useMutation({
    mutationFn: async (nextIds: readonly SymptomId[]) => {
      const { symptomIds: saved } = await replaceSymptomFavorites({
        symptomIds: [...nextIds],
      });
      await saveFavoriteSymptomIds(saved);
      return saved;
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(queryKeys.symptoms.favorites(), saved);
    },
  });

  const favoriteIds = useMemo(
    () => query.data ?? [],
    [query.data],
  );

  const persist = useCallback(
    async (nextIds: readonly SymptomId[]) => {
      await mutation.mutateAsync(nextIds);
    },
    [mutation],
  );

  const toggleFavorite = useCallback(
    async (symptomId: SymptomId) => {
      const next = favoriteIds.includes(symptomId)
        ? favoriteIds.filter((id) => id !== symptomId)
        : [...favoriteIds, symptomId];

      await persist(next);
    },
    [favoriteIds, persist],
  );

  const isFavorite = useCallback(
    (symptomId: SymptomId) => favoriteIds.includes(symptomId),
    [favoriteIds],
  );

  return {
    favoriteIds,
    isLoading: query.isLoading,
    isFavorite,
    toggleFavorite,
    persist,
  };
};
