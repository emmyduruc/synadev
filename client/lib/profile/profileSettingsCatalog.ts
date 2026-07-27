export const PROFILE_SETTINGS_SECTION = {
  personal: 'personal',
  menopause: 'menopause',
  body: 'body',
  heartRisk: 'heart_risk',
  lifestyle: 'lifestyle',
} as const;

export type ProfileSettingsSectionId =
  (typeof PROFILE_SETTINGS_SECTION)[keyof typeof PROFILE_SETTINGS_SECTION];

export const PROFILE_SETTINGS_SECTIONS: readonly ProfileSettingsSectionId[] = [
  PROFILE_SETTINGS_SECTION.menopause,
  PROFILE_SETTINGS_SECTION.body,
  PROFILE_SETTINGS_SECTION.heartRisk,
  PROFILE_SETTINGS_SECTION.lifestyle,
  PROFILE_SETTINGS_SECTION.personal,
];

export const MENOPAUSE_STAGE = {
  premenopause: 'premenopause',
  perimenopauseEarly: 'perimenopause_early',
  latePerimenopause: 'late_perimenopause',
  postmenopause: 'postmenopause',
  unsure: 'unsure',
} as const;

export type MenopauseStageId = (typeof MENOPAUSE_STAGE)[keyof typeof MENOPAUSE_STAGE];

export const MENOPAUSE_STAGE_OPTIONS: readonly MenopauseStageId[] = [
  MENOPAUSE_STAGE.premenopause,
  MENOPAUSE_STAGE.perimenopauseEarly,
  MENOPAUSE_STAGE.latePerimenopause,
  MENOPAUSE_STAGE.postmenopause,
  MENOPAUSE_STAGE.unsure,
];

export const CYCLE_PATTERN = {
  regularly: 'regularly',
  irregular: 'irregular',
  veryIrregular: 'very_irregular',
  missed: 'missed',
  postmenopausal: 'postmenopausal',
} as const;

export type CyclePatternId = (typeof CYCLE_PATTERN)[keyof typeof CYCLE_PATTERN];

export const CYCLE_PATTERN_OPTIONS: readonly CyclePatternId[] = [
  CYCLE_PATTERN.regularly,
  CYCLE_PATTERN.irregular,
  CYCLE_PATTERN.veryIrregular,
  CYCLE_PATTERN.missed,
  CYCLE_PATTERN.postmenopausal,
];

export const HORMONE_THERAPY = {
  yes: 'yes',
  no: 'no',
  unsure: 'unsure',
} as const;

export type HormoneTherapyId = (typeof HORMONE_THERAPY)[keyof typeof HORMONE_THERAPY];

export const HORMONE_THERAPY_OPTIONS: readonly HormoneTherapyId[] = [
  HORMONE_THERAPY.yes,
  HORMONE_THERAPY.no,
  HORMONE_THERAPY.unsure,
];

export const ORIGIN_ETHNICITY = {
  european: 'european',
  southAsian: 'south_asian',
  eastAsian: 'east_asian',
  african: 'african',
  latinAmerican: 'latin_american',
  middleEastern: 'middle_eastern',
  mixed: 'mixed',
  other: 'other',
} as const;

export type OriginEthnicityId = (typeof ORIGIN_ETHNICITY)[keyof typeof ORIGIN_ETHNICITY];

export const ORIGIN_ETHNICITY_OPTIONS: readonly OriginEthnicityId[] = [
  ORIGIN_ETHNICITY.european,
  ORIGIN_ETHNICITY.southAsian,
  ORIGIN_ETHNICITY.eastAsian,
  ORIGIN_ETHNICITY.african,
  ORIGIN_ETHNICITY.latinAmerican,
  ORIGIN_ETHNICITY.middleEastern,
  ORIGIN_ETHNICITY.mixed,
  ORIGIN_ETHNICITY.other,
];

export const FAMILY_CARDIOVASCULAR = {
  no: 'no',
  parentsUnder60: 'parents_under_60',
  parentsOver60: 'parents_over_60',
  siblings: 'siblings',
  severalRelatives: 'several_relatives',
  unknown: 'unknown',
} as const;

export type FamilyCardiovascularId =
  (typeof FAMILY_CARDIOVASCULAR)[keyof typeof FAMILY_CARDIOVASCULAR];

export const FAMILY_CARDIOVASCULAR_OPTIONS: readonly FamilyCardiovascularId[] = [
  FAMILY_CARDIOVASCULAR.no,
  FAMILY_CARDIOVASCULAR.parentsUnder60,
  FAMILY_CARDIOVASCULAR.parentsOver60,
  FAMILY_CARDIOVASCULAR.siblings,
  FAMILY_CARDIOVASCULAR.severalRelatives,
  FAMILY_CARDIOVASCULAR.unknown,
];

export const FAMILY_CANCER = {
  no: 'no',
  breast: 'breast',
  ovarian: 'ovarian',
  uterine: 'uterine',
  colon: 'colon',
  other: 'other',
  unknown: 'unknown',
} as const;

export type FamilyCancerId = (typeof FAMILY_CANCER)[keyof typeof FAMILY_CANCER];

export const FAMILY_CANCER_OPTIONS: readonly FamilyCancerId[] = [
  FAMILY_CANCER.no,
  FAMILY_CANCER.breast,
  FAMILY_CANCER.ovarian,
  FAMILY_CANCER.uterine,
  FAMILY_CANCER.colon,
  FAMILY_CANCER.other,
  FAMILY_CANCER.unknown,
];

export const PREGNANCY_COMPLICATION = {
  no: 'no',
  gestationalDiabetes: 'gestational_diabetes',
  preEclampsia: 'pre_eclampsia',
  highBloodPressure: 'high_blood_pressure',
  prematureBirth: 'premature_birth',
  several: 'several',
  noPregnancy: 'no_pregnancy',
} as const;

export type PregnancyComplicationId =
  (typeof PREGNANCY_COMPLICATION)[keyof typeof PREGNANCY_COMPLICATION];

export const PREGNANCY_COMPLICATION_OPTIONS: readonly PregnancyComplicationId[] = [
  PREGNANCY_COMPLICATION.no,
  PREGNANCY_COMPLICATION.gestationalDiabetes,
  PREGNANCY_COMPLICATION.preEclampsia,
  PREGNANCY_COMPLICATION.highBloodPressure,
  PREGNANCY_COMPLICATION.prematureBirth,
  PREGNANCY_COMPLICATION.several,
  PREGNANCY_COMPLICATION.noPregnancy,
];

export const PCOS_DIAGNOSIS = {
  yes: 'yes',
  no: 'no',
} as const;

export type PcosDiagnosisId = (typeof PCOS_DIAGNOSIS)[keyof typeof PCOS_DIAGNOSIS];

export const PCOS_DIAGNOSIS_OPTIONS: readonly PcosDiagnosisId[] = [
  PCOS_DIAGNOSIS.yes,
  PCOS_DIAGNOSIS.no,
];

export const SMOKING_STATUS = {
  never: 'never',
  earlier: 'earlier',
  occasionally: 'occasionally',
  daily: 'daily',
} as const;

export type SmokingStatusId = (typeof SMOKING_STATUS)[keyof typeof SMOKING_STATUS];

export const SMOKING_STATUS_OPTIONS: readonly SmokingStatusId[] = [
  SMOKING_STATUS.never,
  SMOKING_STATUS.earlier,
  SMOKING_STATUS.occasionally,
  SMOKING_STATUS.daily,
];

export const SOCIAL_BOND = {
  single: 'single',
  relationship: 'relationship',
  married: 'married',
  divorced: 'divorced',
  widowed: 'widowed',
} as const;

export type SocialBondId = (typeof SOCIAL_BOND)[keyof typeof SOCIAL_BOND];

export const SOCIAL_BOND_OPTIONS: readonly SocialBondId[] = [
  SOCIAL_BOND.single,
  SOCIAL_BOND.relationship,
  SOCIAL_BOND.married,
  SOCIAL_BOND.divorced,
  SOCIAL_BOND.widowed,
];

export const SPORT_FREQUENCY = {
  rarely: 'rarely',
  oneToTwo: 'one_to_two',
  threeToFour: 'three_to_four',
  daily: 'daily',
} as const;

export type SportFrequencyId = (typeof SPORT_FREQUENCY)[keyof typeof SPORT_FREQUENCY];

export const SPORT_FREQUENCY_OPTIONS: readonly SportFrequencyId[] = [
  SPORT_FREQUENCY.rarely,
  SPORT_FREQUENCY.oneToTwo,
  SPORT_FREQUENCY.threeToFour,
  SPORT_FREQUENCY.daily,
];

export const WEARABLE = {
  appleWatch: 'apple_watch',
  ouraRing: 'oura_ring',
  garmin: 'garmin',
  fitbit: 'fitbit',
  samsungGalaxyWatch: 'samsung_galaxy_watch',
  whoop: 'whoop',
  other: 'other',
  none: 'none',
} as const;

export type WearableId = (typeof WEARABLE)[keyof typeof WEARABLE];

export const WEARABLE_OPTIONS: readonly WearableId[] = [
  WEARABLE.appleWatch,
  WEARABLE.ouraRing,
  WEARABLE.garmin,
  WEARABLE.fitbit,
  WEARABLE.samsungGalaxyWatch,
  WEARABLE.whoop,
  WEARABLE.other,
  WEARABLE.none,
];

export const PROFILE_OPTION_LABEL_KEYS = {
  menopauseStage: {
    [MENOPAUSE_STAGE.premenopause]: 'profile_option_menopause_premenopause',
    [MENOPAUSE_STAGE.perimenopauseEarly]: 'profile_option_menopause_perimenopause_early',
    [MENOPAUSE_STAGE.latePerimenopause]: 'profile_option_menopause_late_perimenopause',
    [MENOPAUSE_STAGE.postmenopause]: 'profile_option_menopause_postmenopause',
    [MENOPAUSE_STAGE.unsure]: 'profile_option_menopause_unsure',
  },
  cyclePattern: {
    [CYCLE_PATTERN.regularly]: 'profile_option_cycle_regularly',
    [CYCLE_PATTERN.irregular]: 'profile_option_cycle_irregular',
    [CYCLE_PATTERN.veryIrregular]: 'profile_option_cycle_very_irregular',
    [CYCLE_PATTERN.missed]: 'profile_option_cycle_missed',
    [CYCLE_PATTERN.postmenopausal]: 'profile_option_cycle_postmenopausal',
  },
  hormoneTherapy: {
    [HORMONE_THERAPY.yes]: 'profile_option_yes',
    [HORMONE_THERAPY.no]: 'profile_option_no',
    [HORMONE_THERAPY.unsure]: 'profile_option_unsure',
  },
  origin: {
    [ORIGIN_ETHNICITY.european]: 'profile_option_origin_european',
    [ORIGIN_ETHNICITY.southAsian]: 'profile_option_origin_south_asian',
    [ORIGIN_ETHNICITY.eastAsian]: 'profile_option_origin_east_asian',
    [ORIGIN_ETHNICITY.african]: 'profile_option_origin_african',
    [ORIGIN_ETHNICITY.latinAmerican]: 'profile_option_origin_latin_american',
    [ORIGIN_ETHNICITY.middleEastern]: 'profile_option_origin_middle_eastern',
    [ORIGIN_ETHNICITY.mixed]: 'profile_option_origin_mixed',
    [ORIGIN_ETHNICITY.other]: 'profile_option_origin_other',
  },
  familyCardiovascular: {
    [FAMILY_CARDIOVASCULAR.no]: 'profile_option_no',
    [FAMILY_CARDIOVASCULAR.parentsUnder60]: 'profile_option_cvd_parents_under_60',
    [FAMILY_CARDIOVASCULAR.parentsOver60]: 'profile_option_cvd_parents_over_60',
    [FAMILY_CARDIOVASCULAR.siblings]: 'profile_option_cvd_siblings',
    [FAMILY_CARDIOVASCULAR.severalRelatives]: 'profile_option_cvd_several_relatives',
    [FAMILY_CARDIOVASCULAR.unknown]: 'profile_option_unknown',
  },
  familyCancer: {
    [FAMILY_CANCER.no]: 'profile_option_no',
    [FAMILY_CANCER.breast]: 'profile_option_cancer_breast',
    [FAMILY_CANCER.ovarian]: 'profile_option_cancer_ovarian',
    [FAMILY_CANCER.uterine]: 'profile_option_cancer_uterine',
    [FAMILY_CANCER.colon]: 'profile_option_cancer_colon',
    [FAMILY_CANCER.other]: 'profile_option_cancer_other',
    [FAMILY_CANCER.unknown]: 'profile_option_unknown',
  },
  pregnancy: {
    [PREGNANCY_COMPLICATION.no]: 'profile_option_no',
    [PREGNANCY_COMPLICATION.gestationalDiabetes]: 'profile_option_pregnancy_gestational_diabetes',
    [PREGNANCY_COMPLICATION.preEclampsia]: 'profile_option_pregnancy_pre_eclampsia',
    [PREGNANCY_COMPLICATION.highBloodPressure]: 'profile_option_pregnancy_high_blood_pressure',
    [PREGNANCY_COMPLICATION.prematureBirth]: 'profile_option_pregnancy_premature_birth',
    [PREGNANCY_COMPLICATION.several]: 'profile_option_pregnancy_several',
    [PREGNANCY_COMPLICATION.noPregnancy]: 'profile_option_pregnancy_none',
  },
  pcos: {
    [PCOS_DIAGNOSIS.yes]: 'profile_option_yes',
    [PCOS_DIAGNOSIS.no]: 'profile_option_no',
  },
  smoking: {
    [SMOKING_STATUS.never]: 'profile_option_smoking_never',
    [SMOKING_STATUS.earlier]: 'profile_option_smoking_earlier',
    [SMOKING_STATUS.occasionally]: 'profile_option_smoking_occasionally',
    [SMOKING_STATUS.daily]: 'profile_option_smoking_daily',
  },
  socialBond: {
    [SOCIAL_BOND.single]: 'profile_option_social_single',
    [SOCIAL_BOND.relationship]: 'profile_option_social_relationship',
    [SOCIAL_BOND.married]: 'profile_option_social_married',
    [SOCIAL_BOND.divorced]: 'profile_option_social_divorced',
    [SOCIAL_BOND.widowed]: 'profile_option_social_widowed',
  },
  sport: {
    [SPORT_FREQUENCY.rarely]: 'profile_option_sport_rarely',
    [SPORT_FREQUENCY.oneToTwo]: 'profile_option_sport_one_to_two',
    [SPORT_FREQUENCY.threeToFour]: 'profile_option_sport_three_to_four',
    [SPORT_FREQUENCY.daily]: 'profile_option_sport_daily',
  },
  wearable: {
    [WEARABLE.appleWatch]: 'profile_option_wearable_apple_watch',
    [WEARABLE.ouraRing]: 'profile_option_wearable_oura_ring',
    [WEARABLE.garmin]: 'profile_option_wearable_garmin',
    [WEARABLE.fitbit]: 'profile_option_wearable_fitbit',
    [WEARABLE.samsungGalaxyWatch]: 'profile_option_wearable_samsung',
    [WEARABLE.whoop]: 'profile_option_wearable_whoop',
    [WEARABLE.other]: 'profile_option_wearable_other',
    [WEARABLE.none]: 'profile_option_wearable_none',
  },
} as const;
