import { useCallback, useEffect, useState } from 'react';

import {
  loadProfileSettings,
  saveProfileSettings,
} from '@/lib/profile/profileSettingsStorage';
import {
  EMPTY_PROFILE_SETTINGS,
  type ProfileSettingsBodyData,
  type ProfileSettingsData,
  type ProfileSettingsHeartRiskData,
  type ProfileSettingsLifestyleData,
  type ProfileSettingsMenopauseData,
  type ProfileSettingsPersonalExtras,
} from '@/lib/profile/profileSettingsTypes';

export const useProfileSettings = () => {
  const [data, setData] = useState<ProfileSettingsData>(EMPTY_PROFILE_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const next = await loadProfileSettings();
    setData(next);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const persistPatch = useCallback(
    async (patch: (current: ProfileSettingsData) => ProfileSettingsData) => {
      const current = await loadProfileSettings();
      const next = patch(current);
      await saveProfileSettings(next);
      setData(next);
    },
    [],
  );

  const saveMenopause = useCallback(
    async (menopause: ProfileSettingsMenopauseData) => {
      await persistPatch((current) => ({ ...current, menopause }));
    },
    [persistPatch],
  );

  const saveBody = useCallback(
    async (body: ProfileSettingsBodyData) => {
      await persistPatch((current) => ({ ...current, body }));
    },
    [persistPatch],
  );

  const saveHeartRisk = useCallback(
    async (heartRisk: ProfileSettingsHeartRiskData) => {
      await persistPatch((current) => ({ ...current, heartRisk }));
    },
    [persistPatch],
  );

  const saveLifestyle = useCallback(
    async (lifestyle: ProfileSettingsLifestyleData) => {
      await persistPatch((current) => ({ ...current, lifestyle }));
    },
    [persistPatch],
  );

  const savePersonalExtras = useCallback(
    async (personal: ProfileSettingsPersonalExtras) => {
      await persistPatch((current) => ({ ...current, personal }));
    },
    [persistPatch],
  );

  return {
    data,
    isLoading,
    refresh,
    saveMenopause,
    saveBody,
    saveHeartRisk,
    saveLifestyle,
    savePersonalExtras,
  };
};
