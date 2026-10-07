import {
  deleteAsync,
  documentDirectory,
  getInfoAsync,
  writeAsStringAsync,
} from 'expo-file-system/legacy';
import * as SecureStore from 'expo-secure-store';

/**
 * Stored under the app document directory so it is cleared on uninstall.
 * Do not use SecureStore alone — on iOS the Keychain often survives reinstall
 * and incorrectly skips the pre-auth intro (1/3) forever.
 */
const INTRO_COMPLETED_FILE = 'conversion_intro_completed_v4.txt';

/** Legacy Keychain keys from earlier builds (may survive iOS reinstall). */
const LEGACY_SECURE_KEYS = [
  'conversion_intro_completed_v4',
  'conversion_intro_completed_v3',
  'conversion_intro_completed_v2',
  'conversion_intro_completed',
] as const;

const introFileUri = (): string => {
  const base = documentDirectory ?? '';
  return `${base}${INTRO_COMPLETED_FILE}`;
};

const purgeLegacySecureFlags = async (): Promise<void> => {
  await Promise.all(
    LEGACY_SECURE_KEYS.map(async (key) => {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch {
        // Key missing or SecureStore unavailable — ignore.
      }
    }),
  );
};

export const getIntroCompleted = async (): Promise<boolean> => {
  await purgeLegacySecureFlags();

  if (!documentDirectory) {
    return false;
  }

  try {
    const info = await getInfoAsync(introFileUri());
    return info.exists;
  } catch {
    return false;
  }
};

export const setIntroCompleted = async (): Promise<void> => {
  await purgeLegacySecureFlags();

  if (!documentDirectory) {
    return;
  }

  await writeAsStringAsync(introFileUri(), 'true');
};

export const clearIntroCompleted = async (): Promise<void> => {
  await purgeLegacySecureFlags();

  if (!documentDirectory) {
    return;
  }

  try {
    await deleteAsync(introFileUri(), { idempotent: true });
  } catch {
    // ignore
  }
};
