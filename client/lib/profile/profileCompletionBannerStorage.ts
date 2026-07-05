import * as SecureStore from 'expo-secure-store';

const PROFILE_COMPLETION_BANNER_DISMISSED_KEY = 'profile_completion_banner_dismissed';

export const getProfileCompletionBannerDismissed = async (): Promise<boolean> => {
  const value = await SecureStore.getItemAsync(PROFILE_COMPLETION_BANNER_DISMISSED_KEY);
  return value === 'true';
};

export const setProfileCompletionBannerDismissed = async (): Promise<void> => {
  await SecureStore.setItemAsync(PROFILE_COMPLETION_BANNER_DISMISSED_KEY, 'true');
};
