import type {
  CyclePatternId,
  FamilyCancerId,
  FamilyCardiovascularId,
  HormoneTherapyId,
  MenopauseStageId,
  OriginEthnicityId,
  PcosDiagnosisId,
  PregnancyComplicationId,
  SmokingStatusId,
  SocialBondId,
  SportFrequencyId,
  WearableId,
} from '@/lib/profile/profileSettingsCatalog';

export type ProfileSettingsMenopauseData = {
  stage: MenopauseStageId | null;
  cyclePattern: CyclePatternId | null;
  hormoneTherapy: HormoneTherapyId | null;
};

export type ProfileSettingsBodyData = {
  heightCm: string;
  weightKg: string;
  waistCm: string;
};

export type ProfileSettingsHeartRiskData = {
  familyCardiovascular: FamilyCardiovascularId | null;
  familyCancer: FamilyCancerId[];
  pregnancy: PregnancyComplicationId | null;
  pcos: PcosDiagnosisId | null;
};

export type ProfileSettingsLifestyleData = {
  smoking: SmokingStatusId | null;
  socialBond: SocialBondId | null;
  sport: SportFrequencyId | null;
  wearable: WearableId | null;
};

export type ProfileSettingsPersonalExtras = {
  origin: OriginEthnicityId | null;
};

export type ProfileSettingsData = {
  menopause: ProfileSettingsMenopauseData;
  body: ProfileSettingsBodyData;
  heartRisk: ProfileSettingsHeartRiskData;
  lifestyle: ProfileSettingsLifestyleData;
  personal: ProfileSettingsPersonalExtras;
};

export const EMPTY_PROFILE_SETTINGS: ProfileSettingsData = {
  menopause: {
    stage: null,
    cyclePattern: null,
    hormoneTherapy: null,
  },
  body: {
    heightCm: '',
    weightKg: '',
    waistCm: '',
  },
  heartRisk: {
    familyCardiovascular: null,
    familyCancer: [],
    pregnancy: null,
    pcos: null,
  },
  lifestyle: {
    smoking: null,
    socialBond: null,
    sport: null,
    wearable: null,
  },
  personal: {
    origin: null,
  },
};
