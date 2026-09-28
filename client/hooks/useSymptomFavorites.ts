import type { SymptomId } from '@syna/shared-types';
import { useCallback, useEffect, useState } from 'react';

import {
  loadFavoriteSymptomIds,
  saveFavoriteSymptomIds,
} from '@/lib/symptoms/symptomFavoritesStorage';

export const useSymptomFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<SymptomId[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const stored = await loadFavoriteSymptomIds();

        if (isMounted) {
          setFavoriteIds(stored);
        }
      } catch {
        if (isMounted) {
          setFavoriteIds([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  const persist = useCallback(async (nextIds: readonly SymptomId[]) => {
    await saveFavoriteSymptomIds(nextIds);
    setFavoriteIds([...nextIds]);
  }, []);

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

  return { favoriteIds, isLoading, isFavorite, toggleFavorite, persist };
};
