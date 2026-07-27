import * as SecureStore from 'expo-secure-store';

import {
  EMPTY_PROFILE_SETTINGS,
  type ProfileSettingsData,
} from '@/lib/profile/profileSettingsTypes';

const PROFILE_SETTINGS_STORAGE_KEY = 'profile_settings_extended_v1';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const asString = (value: unknown): string =>
  typeof value === 'string' ? value : '';

const asNullableString = (value: unknown): string | null =>
  typeof value === 'string' && value.length > 0 ? value : null;

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];

const parseStored = (raw: string): ProfileSettingsData => {
  const parsed: unknown = JSON.parse(raw);

  if (!isRecord(parsed)) {
    return EMPTY_PROFILE_SETTINGS;
  }

  const menopause = isRecord(parsed.menopause) ? parsed.menopause : {};
  const body = isRecord(parsed.body) ? parsed.body : {};
  const heartRisk = isRecord(parsed.heartRisk) ? parsed.heartRisk : {};
  const lifestyle = isRecord(parsed.lifestyle) ? parsed.lifestyle : {};
  const personal = isRecord(parsed.personal) ? parsed.personal : {};

  return {
    menopause: {
      stage: asNullableString(menopause.stage) as ProfileSettingsData['menopause']['stage'],
      cyclePattern: asNullableString(menopause.cyclePattern) as ProfileSettingsData['menopause']['cyclePattern'],
      hormoneTherapy: asNullableString(menopause.hormoneTherapy) as ProfileSettingsData['menopause']['hormoneTherapy'],
    },
    body: {
      heightCm: asString(body.heightCm),
      weightKg: asString(body.weightKg),
      waistCm: asString(body.waistCm),
    },
    heartRisk: {
      familyCardiovascular: asNullableString(heartRisk.familyCardiovascular) as ProfileSettingsData['heartRisk']['familyCardiovascular'],
      familyCancer: asStringArray(heartRisk.familyCancer) as ProfileSettingsData['heartRisk']['familyCancer'],
      pregnancy: asNullableString(heartRisk.pregnancy) as ProfileSettingsData['heartRisk']['pregnancy'],
      pcos: asNullableString(heartRisk.pcos) as ProfileSettingsData['heartRisk']['pcos'],
    },
    lifestyle: {
      smoking: asNullableString(lifestyle.smoking) as ProfileSettingsData['lifestyle']['smoking'],
      socialBond: asNullableString(lifestyle.socialBond) as ProfileSettingsData['lifestyle']['socialBond'],
      sport: asNullableString(lifestyle.sport) as ProfileSettingsData['lifestyle']['sport'],
      wearable: asNullableString(lifestyle.wearable) as ProfileSettingsData['lifestyle']['wearable'],
    },
    personal: {
      origin: asNullableString(personal.origin) as ProfileSettingsData['personal']['origin'],
    },
  };
};

export const loadProfileSettings = async (): Promise<ProfileSettingsData> => {
  const raw = await SecureStore.getItemAsync(PROFILE_SETTINGS_STORAGE_KEY);

  if (!raw) {
    return EMPTY_PROFILE_SETTINGS;
  }

  try {
    return parseStored(raw);
  } catch {
    return EMPTY_PROFILE_SETTINGS;
  }
};

export const saveProfileSettings = async (
  data: ProfileSettingsData,
): Promise<void> => {
  await SecureStore.setItemAsync(
    PROFILE_SETTINGS_STORAGE_KEY,
    JSON.stringify(data),
  );
};
