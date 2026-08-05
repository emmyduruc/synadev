import * as SecureStore from 'expo-secure-store';

const REMEMBERED_LOGIN_EMAIL_KEY = 'remembered_login_email';

export const loadRememberedLoginEmail = async (): Promise<string> => {
  const value = await SecureStore.getItemAsync(REMEMBERED_LOGIN_EMAIL_KEY);
  return value?.trim() ?? '';
};

export const saveRememberedLoginEmail = async (email: string): Promise<void> => {
  const trimmed = email.trim();

  if (!trimmed) {
    await SecureStore.deleteItemAsync(REMEMBERED_LOGIN_EMAIL_KEY);
    return;
  }

  await SecureStore.setItemAsync(REMEMBERED_LOGIN_EMAIL_KEY, trimmed);
};
