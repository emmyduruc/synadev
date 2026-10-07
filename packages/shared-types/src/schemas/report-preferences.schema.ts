import { z } from 'zod';

import { IsoDateSchema } from './iso-date.schema';

/** Max catalog + custom doctor questions combined (matches report UI). */
export const REPORT_DOCTOR_QUESTION_MAX_SELECTED = 5;

export const REPORT_PERIOD_PRESET = {
  days14: 'days_14',
  days28: 'days_28',
  days90: 'days_90',
  sinceStart: 'since_start',
  custom: 'custom',
} as const;

export const REPORT_PERIOD_PRESETS = [
  REPORT_PERIOD_PRESET.days14,
  REPORT_PERIOD_PRESET.days28,
  REPORT_PERIOD_PRESET.days90,
  REPORT_PERIOD_PRESET.sinceStart,
  REPORT_PERIOD_PRESET.custom,
] as const;

export const ReportPeriodPresetSchema = z
  .enum(REPORT_PERIOD_PRESETS)
  .describe('Report period preset id');

export type ReportPeriodPresetId = z.infer<typeof ReportPeriodPresetSchema>;

export const REPORT_DOCTOR_QUESTION_IDS = [
  'heart_palpitations',
  'blood_pressure',
  'which_values',
  'dizziness_hot_flashes',
  'night_waking_cause',
  'sleep_night_sweats',
  'sleep_other_symptoms',
  'awake_at_night',
  'mood_hormones',
  'psychological_support',
  'inner_restlessness',
  'hormonal_vs_other',
  'bleeding_changes_usual',
  'bleeding_clarify',
  'bleeding_intervals',
  'contraception',
  'bleeding_exams',
  'joint_complaints',
  'bone_health',
  'movement_nutrition_joints',
  'bone_density_exams',
  'concentration_work',
  'daily_limits',
  'talk_at_work',
  'support_offers',
  'therapy_options',
  'hormone_therapy_pros_cons',
  'non_hormonal_options',
  'change_nothing',
  'notice_adjust',
  'when_follow_up',
] as const;

export const ReportDoctorQuestionIdSchema = z
  .enum(REPORT_DOCTOR_QUESTION_IDS)
  .describe('Catalog doctor question id for the report tab');

export type ReportDoctorQuestionId = z.infer<typeof ReportDoctorQuestionIdSchema>;

export const REPORT_CONCERN_IDS = [
  'taken_seriously',
  'open_communication',
  'not_heard_before',
  'understand_numbers',
  'treatment_options',
  'orient_only',
  'perimenopause_uncertain',
  'decide_together',
  'little_time',
  'watch_next_months',
] as const;

export const ReportConcernIdSchema = z
  .enum(REPORT_CONCERN_IDS)
  .describe('Patient concern chip id for the report tab');

export type ReportConcernId = z.infer<typeof ReportConcernIdSchema>;

const CustomDoctorQuestionTextSchema = z
  .string()
  .trim()
  .min(1)
  .max(500)
  .describe('User-authored doctor question text');

export const ReportPreferencesSchema = z
  .object({
    periodPreset: ReportPeriodPresetSchema.nullable().describe(
      'Last selected period preset, or null when unset',
    ),
    periodFromDate: IsoDateSchema.nullable().describe(
      'Inclusive range start YYYY-MM-DD when a custom or frozen range is set',
    ),
    periodToDate: IsoDateSchema.nullable().describe(
      'Inclusive range end YYYY-MM-DD when a custom or frozen range is set',
    ),
    doctorQuestionIds: z
      .array(ReportDoctorQuestionIdSchema)
      .describe('Ordered catalog doctor question selections'),
    customDoctorQuestions: z
      .array(CustomDoctorQuestionTextSchema)
      .describe('Ordered custom doctor questions'),
    concernIds: z
      .array(ReportConcernIdSchema)
      .describe('Ordered patient concern chip selections'),
    concernFreeText: z
      .string()
      .max(2000)
      .nullable()
      .describe('Optional freitext under patient concerns'),
  })
  .superRefine((value, ctx) => {
    const questionCount =
      value.doctorQuestionIds.length + value.customDoctorQuestions.length;

    if (questionCount > REPORT_DOCTOR_QUESTION_MAX_SELECTED) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `At most ${REPORT_DOCTOR_QUESTION_MAX_SELECTED} doctor questions allowed`,
        path: ['doctorQuestionIds'],
      });
    }

    if (
      value.periodFromDate &&
      value.periodToDate &&
      value.periodFromDate > value.periodToDate
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'periodFromDate must be on or before periodToDate',
        path: ['periodFromDate'],
      });
    }
  })
  .describe('Persisted report-tab preferences for the authenticated user');

export type ReportPreferences = z.infer<typeof ReportPreferencesSchema>;

/** Full replace body for PUT /report/preferences. */
export const UpdateReportPreferencesSchema = ReportPreferencesSchema;

export type UpdateReportPreferences = z.infer<typeof UpdateReportPreferencesSchema>;

export const createEmptyReportPreferences = (): ReportPreferences => ({
  periodPreset: null,
  periodFromDate: null,
  periodToDate: null,
  doctorQuestionIds: [],
  customDoctorQuestions: [],
  concernIds: [],
  concernFreeText: null,
});
