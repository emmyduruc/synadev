import * as SecureStore from 'expo-secure-store';

const HOME_WELCOME_MODAL_DISMISSED_KEY = 'home_welcome_modal_dismissed';

export const getHomeWelcomeModalDismissed = async (): Promise<boolean> => {
  const value = await SecureStore.getItemAsync(HOME_WELCOME_MODAL_DISMISSED_KEY);
  return value === 'true';
};

export const setHomeWelcomeModalDismissed = async (): Promise<void> => {
  await SecureStore.setItemAsync(HOME_WELCOME_MODAL_DISMISSED_KEY, 'true');
};

export const clearHomeWelcomeModalDismissed = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(HOME_WELCOME_MODAL_DISMISSED_KEY);
};
