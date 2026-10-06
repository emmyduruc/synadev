export const REPORT_DOCTOR_QUESTION_CATEGORY = {
  all: 'all',
  heartCirculation: 'heart_circulation',
  sleep: 'sleep',
  mood: 'mood',
  bleeding: 'bleeding',
  joints: 'joints',
  work: 'work',
  therapy: 'therapy',
} as const;

export type ReportDoctorQuestionCategoryId =
  (typeof REPORT_DOCTOR_QUESTION_CATEGORY)[keyof typeof REPORT_DOCTOR_QUESTION_CATEGORY];

export const REPORT_DOCTOR_QUESTION_CATEGORY_ORDER = [
  REPORT_DOCTOR_QUESTION_CATEGORY.all,
  REPORT_DOCTOR_QUESTION_CATEGORY.heartCirculation,
  REPORT_DOCTOR_QUESTION_CATEGORY.sleep,
  REPORT_DOCTOR_QUESTION_CATEGORY.mood,
  REPORT_DOCTOR_QUESTION_CATEGORY.bleeding,
  REPORT_DOCTOR_QUESTION_CATEGORY.joints,
  REPORT_DOCTOR_QUESTION_CATEGORY.work,
  REPORT_DOCTOR_QUESTION_CATEGORY.therapy,
] as const satisfies readonly ReportDoctorQuestionCategoryId[];

export const REPORT_DOCTOR_QUESTION_CATEGORY_LABEL_KEY: Record<
  ReportDoctorQuestionCategoryId,
  string
> = {
  all: 'report_doctor_question_category_all',
  heart_circulation: 'report_doctor_question_category_heart',
  sleep: 'report_doctor_question_category_sleep',
  mood: 'report_doctor_question_category_mood',
  bleeding: 'report_doctor_question_category_bleeding',
  joints: 'report_doctor_question_category_joints',
  work: 'report_doctor_question_category_work',
  therapy: 'report_doctor_question_category_therapy',
};

export const REPORT_DOCTOR_QUESTION_ID = {
  heartPalpitations: 'heart_palpitations',
  bloodPressure: 'blood_pressure',
  whichValues: 'which_values',
  dizzinessHotFlashes: 'dizziness_hot_flashes',
  nightWakingCause: 'night_waking_cause',
  sleepNightSweats: 'sleep_night_sweats',
  sleepOtherSymptoms: 'sleep_other_symptoms',
  awakeAtNight: 'awake_at_night',
  moodHormones: 'mood_hormones',
  psychologicalSupport: 'psychological_support',
  innerRestlessness: 'inner_restlessness',
  hormonalVsOther: 'hormonal_vs_other',
  bleedingChangesUsual: 'bleeding_changes_usual',
  bleedingClarify: 'bleeding_clarify',
  bleedingIntervals: 'bleeding_intervals',
  contraception: 'contraception',
  bleedingExams: 'bleeding_exams',
  jointComplaints: 'joint_complaints',
  boneHealth: 'bone_health',
  movementNutritionJoints: 'movement_nutrition_joints',
  boneDensityExams: 'bone_density_exams',
  concentrationWork: 'concentration_work',
  dailyLimits: 'daily_limits',
  talkAtWork: 'talk_at_work',
  supportOffers: 'support_offers',
  therapyOptions: 'therapy_options',
  hormoneTherapyProsCons: 'hormone_therapy_pros_cons',
  nonHormonalOptions: 'non_hormonal_options',
  changeNothing: 'change_nothing',
  noticeAdjust: 'notice_adjust',
  whenFollowUp: 'when_follow_up',
} as const;

export type ReportDoctorQuestionId =
  (typeof REPORT_DOCTOR_QUESTION_ID)[keyof typeof REPORT_DOCTOR_QUESTION_ID];

export type ReportDoctorQuestion = {
  id: ReportDoctorQuestionId;
  labelKey: string;
  categoryId: Exclude<
    ReportDoctorQuestionCategoryId,
    typeof REPORT_DOCTOR_QUESTION_CATEGORY.all
  >;
};

export const REPORT_DOCTOR_QUESTIONS: Record<
  ReportDoctorQuestionId,
  ReportDoctorQuestion
> = {
  heart_palpitations: {
    id: REPORT_DOCTOR_QUESTION_ID.heartPalpitations,
    labelKey: 'report_doctor_question_heart_palpitations',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.heartCirculation,
  },
  blood_pressure: {
    id: REPORT_DOCTOR_QUESTION_ID.bloodPressure,
    labelKey: 'report_doctor_question_blood_pressure',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.heartCirculation,
  },
  which_values: {
    id: REPORT_DOCTOR_QUESTION_ID.whichValues,
    labelKey: 'report_doctor_question_which_values',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.heartCirculation,
  },
  dizziness_hot_flashes: {
    id: REPORT_DOCTOR_QUESTION_ID.dizzinessHotFlashes,
    labelKey: 'report_doctor_question_dizziness_hot_flashes',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.heartCirculation,
  },
  night_waking_cause: {
    id: REPORT_DOCTOR_QUESTION_ID.nightWakingCause,
    labelKey: 'report_doctor_question_night_waking_cause',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.sleep,
  },
  sleep_night_sweats: {
    id: REPORT_DOCTOR_QUESTION_ID.sleepNightSweats,
    labelKey: 'report_doctor_question_sleep_night_sweats',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.sleep,
  },
  sleep_other_symptoms: {
    id: REPORT_DOCTOR_QUESTION_ID.sleepOtherSymptoms,
    labelKey: 'report_doctor_question_sleep_other_symptoms',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.sleep,
  },
  awake_at_night: {
    id: REPORT_DOCTOR_QUESTION_ID.awakeAtNight,
    labelKey: 'report_doctor_question_awake_at_night',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.sleep,
  },
  mood_hormones: {
    id: REPORT_DOCTOR_QUESTION_ID.moodHormones,
    labelKey: 'report_doctor_question_mood_hormones',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.mood,
  },
  psychological_support: {
    id: REPORT_DOCTOR_QUESTION_ID.psychologicalSupport,
    labelKey: 'report_doctor_question_psychological_support',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.mood,
  },
  inner_restlessness: {
    id: REPORT_DOCTOR_QUESTION_ID.innerRestlessness,
    labelKey: 'report_doctor_question_inner_restlessness',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.mood,
  },
  hormonal_vs_other: {
    id: REPORT_DOCTOR_QUESTION_ID.hormonalVsOther,
    labelKey: 'report_doctor_question_hormonal_vs_other',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.mood,
  },
  bleeding_changes_usual: {
    id: REPORT_DOCTOR_QUESTION_ID.bleedingChangesUsual,
    labelKey: 'report_doctor_question_bleeding_changes_usual',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.bleeding,
  },
  bleeding_clarify: {
    id: REPORT_DOCTOR_QUESTION_ID.bleedingClarify,
    labelKey: 'report_doctor_question_bleeding_clarify',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.bleeding,
  },
  bleeding_intervals: {
    id: REPORT_DOCTOR_QUESTION_ID.bleedingIntervals,
    labelKey: 'report_doctor_question_bleeding_intervals',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.bleeding,
  },
  contraception: {
    id: REPORT_DOCTOR_QUESTION_ID.contraception,
    labelKey: 'report_doctor_question_contraception',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.bleeding,
  },
  bleeding_exams: {
    id: REPORT_DOCTOR_QUESTION_ID.bleedingExams,
    labelKey: 'report_doctor_question_bleeding_exams',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.bleeding,
  },
  joint_complaints: {
    id: REPORT_DOCTOR_QUESTION_ID.jointComplaints,
    labelKey: 'report_doctor_question_joint_complaints',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.joints,
  },
  bone_health: {
    id: REPORT_DOCTOR_QUESTION_ID.boneHealth,
    labelKey: 'report_doctor_question_bone_health',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.joints,
  },
  movement_nutrition_joints: {
    id: REPORT_DOCTOR_QUESTION_ID.movementNutritionJoints,
    labelKey: 'report_doctor_question_movement_nutrition_joints',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.joints,
  },
  bone_density_exams: {
    id: REPORT_DOCTOR_QUESTION_ID.boneDensityExams,
    labelKey: 'report_doctor_question_bone_density_exams',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.joints,
  },
  concentration_work: {
    id: REPORT_DOCTOR_QUESTION_ID.concentrationWork,
    labelKey: 'report_doctor_question_concentration_work',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.work,
  },
  daily_limits: {
    id: REPORT_DOCTOR_QUESTION_ID.dailyLimits,
    labelKey: 'report_doctor_question_daily_limits',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.work,
  },
  talk_at_work: {
    id: REPORT_DOCTOR_QUESTION_ID.talkAtWork,
    labelKey: 'report_doctor_question_talk_at_work',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.work,
  },
  support_offers: {
    id: REPORT_DOCTOR_QUESTION_ID.supportOffers,
    labelKey: 'report_doctor_question_support_offers',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.work,
  },
  therapy_options: {
    id: REPORT_DOCTOR_QUESTION_ID.therapyOptions,
    labelKey: 'report_doctor_question_therapy_options',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.therapy,
  },
  hormone_therapy_pros_cons: {
    id: REPORT_DOCTOR_QUESTION_ID.hormoneTherapyProsCons,
    labelKey: 'report_doctor_question_hormone_therapy_pros_cons',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.therapy,
  },
  non_hormonal_options: {
    id: REPORT_DOCTOR_QUESTION_ID.nonHormonalOptions,
    labelKey: 'report_doctor_question_non_hormonal_options',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.therapy,
  },
  change_nothing: {
    id: REPORT_DOCTOR_QUESTION_ID.changeNothing,
    labelKey: 'report_doctor_question_change_nothing',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.therapy,
  },
  notice_adjust: {
    id: REPORT_DOCTOR_QUESTION_ID.noticeAdjust,
    labelKey: 'report_doctor_question_notice_adjust',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.therapy,
  },
  when_follow_up: {
    id: REPORT_DOCTOR_QUESTION_ID.whenFollowUp,
    labelKey: 'report_doctor_question_when_follow_up',
    categoryId: REPORT_DOCTOR_QUESTION_CATEGORY.therapy,
  },
};

/** Display order for the Alle list (matches prototype). */
export const REPORT_DOCTOR_QUESTION_ORDER = [
  REPORT_DOCTOR_QUESTION_ID.heartPalpitations,
  REPORT_DOCTOR_QUESTION_ID.bloodPressure,
  REPORT_DOCTOR_QUESTION_ID.whichValues,
  REPORT_DOCTOR_QUESTION_ID.dizzinessHotFlashes,
  REPORT_DOCTOR_QUESTION_ID.nightWakingCause,
  REPORT_DOCTOR_QUESTION_ID.sleepNightSweats,
  REPORT_DOCTOR_QUESTION_ID.sleepOtherSymptoms,
  REPORT_DOCTOR_QUESTION_ID.awakeAtNight,
  REPORT_DOCTOR_QUESTION_ID.moodHormones,
  REPORT_DOCTOR_QUESTION_ID.psychologicalSupport,
  REPORT_DOCTOR_QUESTION_ID.innerRestlessness,
  REPORT_DOCTOR_QUESTION_ID.hormonalVsOther,
  REPORT_DOCTOR_QUESTION_ID.bleedingChangesUsual,
  REPORT_DOCTOR_QUESTION_ID.bleedingClarify,
  REPORT_DOCTOR_QUESTION_ID.bleedingIntervals,
  REPORT_DOCTOR_QUESTION_ID.contraception,
  REPORT_DOCTOR_QUESTION_ID.bleedingExams,
  REPORT_DOCTOR_QUESTION_ID.jointComplaints,
  REPORT_DOCTOR_QUESTION_ID.boneHealth,
  REPORT_DOCTOR_QUESTION_ID.movementNutritionJoints,
  REPORT_DOCTOR_QUESTION_ID.boneDensityExams,
  REPORT_DOCTOR_QUESTION_ID.concentrationWork,
  REPORT_DOCTOR_QUESTION_ID.dailyLimits,
  REPORT_DOCTOR_QUESTION_ID.talkAtWork,
  REPORT_DOCTOR_QUESTION_ID.supportOffers,
  REPORT_DOCTOR_QUESTION_ID.therapyOptions,
  REPORT_DOCTOR_QUESTION_ID.hormoneTherapyProsCons,
  REPORT_DOCTOR_QUESTION_ID.nonHormonalOptions,
  REPORT_DOCTOR_QUESTION_ID.changeNothing,
  REPORT_DOCTOR_QUESTION_ID.noticeAdjust,
  REPORT_DOCTOR_QUESTION_ID.whenFollowUp,
] as const satisfies readonly ReportDoctorQuestionId[];

/**
 * Category → question ids.
 * Alle lists every question. Categories are filled step by step from the
 * prototype (Herz & Kreislauf done; remaining chips stay empty until next).
 */
export const REPORT_DOCTOR_QUESTION_IDS_BY_CATEGORY: Record<
  ReportDoctorQuestionCategoryId,
  readonly ReportDoctorQuestionId[]
> = {
  all: REPORT_DOCTOR_QUESTION_ORDER,
  heart_circulation: [
    REPORT_DOCTOR_QUESTION_ID.heartPalpitations,
    REPORT_DOCTOR_QUESTION_ID.bloodPressure,
    REPORT_DOCTOR_QUESTION_ID.whichValues,
    REPORT_DOCTOR_QUESTION_ID.dizzinessHotFlashes,
  ],
  sleep: [
    REPORT_DOCTOR_QUESTION_ID.nightWakingCause,
    REPORT_DOCTOR_QUESTION_ID.sleepNightSweats,
    REPORT_DOCTOR_QUESTION_ID.sleepOtherSymptoms,
    REPORT_DOCTOR_QUESTION_ID.awakeAtNight,
  ],
  mood: [
    REPORT_DOCTOR_QUESTION_ID.moodHormones,
    REPORT_DOCTOR_QUESTION_ID.psychologicalSupport,
    REPORT_DOCTOR_QUESTION_ID.innerRestlessness,
    REPORT_DOCTOR_QUESTION_ID.hormonalVsOther,
  ],
  bleeding: [
    REPORT_DOCTOR_QUESTION_ID.bleedingChangesUsual,
    REPORT_DOCTOR_QUESTION_ID.bleedingClarify,
    REPORT_DOCTOR_QUESTION_ID.bleedingIntervals,
    REPORT_DOCTOR_QUESTION_ID.contraception,
    REPORT_DOCTOR_QUESTION_ID.bleedingExams,
  ],
  joints: [
    REPORT_DOCTOR_QUESTION_ID.jointComplaints,
    REPORT_DOCTOR_QUESTION_ID.boneHealth,
    REPORT_DOCTOR_QUESTION_ID.movementNutritionJoints,
    REPORT_DOCTOR_QUESTION_ID.boneDensityExams,
  ],
  work: [
    REPORT_DOCTOR_QUESTION_ID.concentrationWork,
    REPORT_DOCTOR_QUESTION_ID.dailyLimits,
    REPORT_DOCTOR_QUESTION_ID.talkAtWork,
    REPORT_DOCTOR_QUESTION_ID.supportOffers,
  ],
  therapy: [],
};

export const REPORT_DOCTOR_QUESTION_MAX_SELECTED = 5;

export const getReportDoctorQuestionsForCategory = (
  categoryId: ReportDoctorQuestionCategoryId,
): readonly ReportDoctorQuestion[] =>
  REPORT_DOCTOR_QUESTION_IDS_BY_CATEGORY[categoryId].map(
    (questionId) => REPORT_DOCTOR_QUESTIONS[questionId],
  );
