import * as SecureStore from 'expo-secure-store';

/** Bump when new intro steps ship so returning users see the updated flow. */
const INTRO_COMPLETED_KEY = 'conversion_intro_completed_v3';

export const getIntroCompleted = async (): Promise<boolean> => {
  const value = await SecureStore.getItemAsync(INTRO_COMPLETED_KEY);
  return value === 'true';
};

export const setIntroCompleted = async (): Promise<void> => {
  await SecureStore.setItemAsync(INTRO_COMPLETED_KEY, 'true');
};
