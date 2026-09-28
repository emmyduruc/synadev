import type { SymptomId } from '@syna/shared-types';
import { useCallback, useEffect, useState } from 'react';

import { getSymptomFavorites, replaceSymptomFavorites } from '@/lib/api';
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
        const { symptomIds } = await getSymptomFavorites();

        if (symptomIds.length > 0) {
          if (isMounted) {
            setFavoriteIds(symptomIds);
          }

          await saveFavoriteSymptomIds(symptomIds);
          return;
        }

        // One-time migrate device-local favorites to the API when the server list is empty.
        const localIds = await loadFavoriteSymptomIds();

        if (localIds.length > 0) {
          const { symptomIds: saved } = await replaceSymptomFavorites({
            symptomIds: localIds,
          });

          if (isMounted) {
            setFavoriteIds(saved);
          }

          return;
        }

        if (isMounted) {
          setFavoriteIds([]);
        }
      } catch {
        try {
          const localIds = await loadFavoriteSymptomIds();

          if (isMounted) {
            setFavoriteIds(localIds);
          }
        } catch {
          if (isMounted) {
            setFavoriteIds([]);
          }
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
    const { symptomIds: saved } = await replaceSymptomFavorites({
      symptomIds: [...nextIds],
    });
    setFavoriteIds(saved);
    await saveFavoriteSymptomIds(saved);
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
