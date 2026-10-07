import {
  deleteAsync,
  documentDirectory,
  getInfoAsync,
  writeAsStringAsync,
} from 'expo-file-system/legacy';

/**
 * Tracks whether the user finished (or skipped) connect-health onboarding.
 * Cleared on account delete so a new account sees connect-health again.
 * Document-directory storage so it does not survive app uninstall.
 */
const HEALTH_ONBOARDING_FILE = 'health_onboarding_completed_v1.txt';

const healthOnboardingFileUri = (): string => {
  const base = documentDirectory ?? '';
  return `${base}${HEALTH_ONBOARDING_FILE}`;
};

export const getHealthOnboardingCompleted = async (): Promise<boolean> => {
  if (!documentDirectory) {
    return false;
  }

  try {
    const info = await getInfoAsync(healthOnboardingFileUri());
    return info.exists;
  } catch {
    return false;
  }
};

export const setHealthOnboardingCompleted = async (): Promise<void> => {
  if (!documentDirectory) {
    return;
  }

  await writeAsStringAsync(healthOnboardingFileUri(), 'true');
};

export const clearHealthOnboardingCompleted = async (): Promise<void> => {
  if (!documentDirectory) {
    return;
  }

  try {
    await deleteAsync(healthOnboardingFileUri(), { idempotent: true });
  } catch {
    // ignore
  }
};
