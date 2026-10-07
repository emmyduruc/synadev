import { saveRememberedLoginEmail } from '@/lib/auth/rememberedLoginEmailStorage';
import { clearDeepeningEntries } from '@/lib/deepening/deepeningStorage';
import { clearHealthConnectionSummary } from '@/lib/health/healthConnectionSummary';
import { clearMrsIiBannerStorage } from '@/lib/mrs/mrsIiBannerStorage';
import { clearPatientActivationMeasureBannerStorage } from '@/lib/patientActivationMeasure/patientActivationMeasureBannerStorage';
import {
  clearBioData,
  invalidateBioDataWrites,
} from '@/lib/profile/bioDataStorage';
import { clearProfileCompletionBannerDismissed } from '@/lib/profile/profileCompletionBannerStorage';
import { clearProfileSettings } from '@/lib/profile/profileSettingsStorage';
import { clearFavoriteSymptomIds } from '@/lib/symptoms/symptomFavoritesStorage';

/**
 * Clears local SecureStore caches tied to the signed-in user.
 * Call after account deletion only — not on sign-out — so a returning user
 * keeps their bio cache, while a new account cannot inherit the old one.
 */
export const clearLocalUserData = async (): Promise<void> => {
  // Kill in-flight bio writes before awaiting deletes.
  invalidateBioDataWrites();

  await Promise.all([
    clearBioData(),
    clearProfileSettings(),
    clearDeepeningEntries(),
    clearFavoriteSymptomIds(),
    clearHealthConnectionSummary(),
    clearMrsIiBannerStorage(),
    clearPatientActivationMeasureBannerStorage(),
    clearProfileCompletionBannerDismissed(),
    saveRememberedLoginEmail(''),
  ]);
};
