import { saveRememberedLoginEmail } from '@/lib/auth/rememberedLoginEmailStorage';
import { clearBioData } from '@/lib/profile/bioDataStorage';
import { clearProfileSettings } from '@/lib/profile/profileSettingsStorage';

/**
 * Clears local SecureStore caches tied to the signed-in user.
 * Call after sign-out or account deletion.
 */
export const clearLocalUserData = async (): Promise<void> => {
  await Promise.all([
    clearBioData(),
    clearProfileSettings(),
    saveRememberedLoginEmail(''),
  ]);
};
