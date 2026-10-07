import {
  deleteAsync,
  documentDirectory,
  getInfoAsync,
  writeAsStringAsync,
} from 'expo-file-system/legacy';

/**
 * Tracks whether the user finished (or skipped) notification onboarding.
 * Cleared on account delete. Document directory so uninstall resets it.
 */
const NOTIFICATION_ONBOARDING_FILE = 'notification_onboarding_completed_v1.txt';

const notificationOnboardingFileUri = (): string => {
  const base = documentDirectory ?? '';
  return `${base}${NOTIFICATION_ONBOARDING_FILE}`;
};

export const getNotificationOnboardingCompleted = async (): Promise<boolean> => {
  if (!documentDirectory) {
    return false;
  }

  try {
    const info = await getInfoAsync(notificationOnboardingFileUri());
    return info.exists;
  } catch {
    return false;
  }
};

export const setNotificationOnboardingCompleted = async (): Promise<void> => {
  if (!documentDirectory) {
    return;
  }

  await writeAsStringAsync(notificationOnboardingFileUri(), 'true');
};

export const clearNotificationOnboardingCompleted = async (): Promise<void> => {
  if (!documentDirectory) {
    return;
  }

  try {
    await deleteAsync(notificationOnboardingFileUri(), { idempotent: true });
  } catch {
    // ignore
  }
};
