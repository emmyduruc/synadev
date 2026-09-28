import { isSymptomId, type SymptomId } from '@syna/shared-types';
import * as SecureStore from 'expo-secure-store';

export const SYMPTOM_FAVORITES_STORAGE_KEY = 'syna_favorite_symptom_ids';

const parseFavoriteIds = (raw: string | null): SymptomId[] => {
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((value): value is SymptomId => typeof value === 'string' && isSymptomId(value));
  } catch {
    return [];
  }
};

export const loadFavoriteSymptomIds = async (): Promise<SymptomId[]> => {
  const raw = await SecureStore.getItemAsync(SYMPTOM_FAVORITES_STORAGE_KEY);

  return parseFavoriteIds(raw);
};

export const saveFavoriteSymptomIds = async (symptomIds: readonly SymptomId[]): Promise<void> => {
  if (symptomIds.length === 0) {
    await SecureStore.deleteItemAsync(SYMPTOM_FAVORITES_STORAGE_KEY);
    return;
  }

  await SecureStore.setItemAsync(SYMPTOM_FAVORITES_STORAGE_KEY, JSON.stringify([...symptomIds]));
};
