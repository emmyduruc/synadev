import {
  CreateCustomSymptomSchema,
  CustomSymptomSchema,
  CustomSymptomsSchema,
  CyclePhaseSnapshotSchema,
  ChatRequestSchema,
  ChatResponseSchema,
  HealthDailyMetricsSchema,
  HealthResponseSchema,
  MoodLogsSchema,
  MrsIiAssessmentSubmissionSchema,
  Pam13AssessmentSubmissionSchema,
  Pam13LatestSchema,
  PeriodDaysSchema,
  Phq2AssessmentSubmissionSchema,
  Phq2LatestSchema,
  RegisterPushTokenResponseSchema,
  RegisterPushTokenSchema,
  ReplaceMoodLogsSchema,
  ReplacePeriodDaysSchema,
  ReplaceSymptomFavoritesSchema,
  ReplaceSymptomLogsSchema,
  ClinicalProfileSchema,
  ReportPreferencesSchema,
  SubmitMrsIiAssessmentSchema,
  SubmitPam13AssessmentSchema,
  SubmitPhq2AssessmentSchema,
  SymptomCatalogSchema,
  SymptomFavoritesSchema,
  SymptomLogsSchema,
  UpdateClinicalProfileSchema,
  UpdateReportPreferencesSchema,
  UpdateUserAppointmentSchema,
  UpdateUserHealthMetricsSchema,
  UpdateUserHealthRecordSchema,
  UpdateUserLocaleSchema,
  UpdateUserProfileSchema,
  UpsertHealthDailyMetricsSchema,
  UserAppointmentSchema,
  UserSchema,
} from '@syna/shared-types';
import type {
  ChatRequest,
  ChatResponse,
  ClinicalProfile,
  CreateCustomSymptom,
  CustomSymptom,
  CustomSymptoms,
  CyclePhaseSnapshotDto,
  GetHealthDailyMetricsQuery,
  HealthDailyMetrics,
  HealthResponse,
  MoodLogs,
  MrsIiAssessmentSubmission,
  MrsIiLatest,
  Pam13AssessmentSubmission,
  Pam13Latest,
  PeriodDays,
  Phq2AssessmentSubmission,
  Phq2Latest,
  RegisterPushToken,
  RegisterPushTokenResponse,
  ReplaceMoodLogs,
  ReplacePeriodDays,
  ReplaceSymptomFavorites,
  ReplaceSymptomLogs,
  ReportPreferences,
  SubmitMrsIiAssessment,
  SubmitPam13Assessment,
  SubmitPhq2Assessment,
  SymptomCatalog,
  SymptomFavorites,
  SymptomLogs,
  UpdateClinicalProfile,
  UpdateReportPreferences,
  UpdateUserAppointment,
  UpdateUserHealthMetrics,
  UpdateUserHealthRecord,
  UpdateUserLocale,
  UpdateUserProfile,
  UpsertHealthDailyMetrics,
  User,
  UserAppointment,
} from '@syna/shared-types';

import {
  APPOINTMENTS_ME,
  ASSESSMENTS_MRS_II,
  ASSESSMENTS_MRS_II_LATEST,
  ASSESSMENTS_PAM_13,
  ASSESSMENTS_PAM_13_LATEST,
  ASSESSMENTS_PHQ_2,
  ASSESSMENTS_PHQ_2_LATEST,
  CHAT,
  CLINICAL_PROFILE_ME,
  CYCLE_PHASE,
  HEALTH,
  HEALTH_DAILY,
  MOOD_LOGS,
  NOTIFICATIONS_PUSH_TOKEN,
  PERIOD_DAYS,
  REPORT_PREFERENCES,
  SYMPTOM_CATALOG,
  SYMPTOM_CUSTOM,
  SYMPTOM_FAVORITES,
  SYMPTOM_LOGS,
  USERS_ME,
  USERS_ME_HEALTH_METRICS,
  USERS_ME_HEALTH_RECORD,
  USERS_ME_LOCALE,
} from './apiEndpoints';
import { apiRequest, httpClient } from './http';
import { parseMrsIiLatest } from './mrs/parseMrsIiLatest';

export const getHealth = (): Promise<HealthResponse> =>
  apiRequest({
    url: HEALTH,
    method: 'GET',
    responseSchema: HealthResponseSchema,
  });

/** Shared in-flight GET /users/me so concurrent callers (e.g. home + banner) hit the network once. */
let getCurrentUserInFlight: Promise<User> | null = null;

/** Provisions the Syna user row on first call, then returns the profile. */
export const getCurrentUser = (): Promise<User> => {
  if (!getCurrentUserInFlight) {
    getCurrentUserInFlight = apiRequest({
      url: USERS_ME,
      method: 'GET',
      responseSchema: UserSchema,
    }).finally(() => {
      getCurrentUserInFlight = null;
    });
  }

  return getCurrentUserInFlight;
};

export const updateCurrentUserProfile = (input: UpdateUserProfile): Promise<User> =>
  apiRequest({
    url: USERS_ME,
    method: 'PATCH',
    body: input,
    bodySchema: UpdateUserProfileSchema,
    responseSchema: UserSchema,
  });

export const updateCurrentUserHealthMetrics = (
  input: UpdateUserHealthMetrics,
): Promise<User> =>
  apiRequest({
    url: USERS_ME_HEALTH_METRICS,
    method: 'PATCH',
    body: input,
    bodySchema: UpdateUserHealthMetricsSchema,
    responseSchema: UserSchema,
  });

export const updateCurrentUserHealthRecord = (
  input: UpdateUserHealthRecord,
): Promise<User> =>
  apiRequest({
    url: USERS_ME_HEALTH_RECORD,
    method: 'PATCH',
    body: input,
    bodySchema: UpdateUserHealthRecordSchema,
    responseSchema: UserSchema,
  });

export const getHealthDailyMetrics = (
  query: GetHealthDailyMetricsQuery,
): Promise<HealthDailyMetrics> =>
  apiRequest({
    url: HEALTH_DAILY,
    method: 'GET',
    params: query,
    responseSchema: HealthDailyMetricsSchema,
  });

export const upsertHealthDailyMetrics = (
  input: UpsertHealthDailyMetrics,
): Promise<HealthDailyMetrics> =>
  apiRequest({
    url: HEALTH_DAILY,
    method: 'PUT',
    body: input,
    bodySchema: UpsertHealthDailyMetricsSchema,
    responseSchema: HealthDailyMetricsSchema,
  });

export const updateCurrentUserLocale = (input: UpdateUserLocale): Promise<User> =>
  apiRequest({
    url: USERS_ME_LOCALE,
    method: 'PATCH',
    body: input,
    bodySchema: UpdateUserLocaleSchema,
    responseSchema: UserSchema,
  });

export const getPeriodDays = (): Promise<PeriodDays> =>
  apiRequest({
    url: PERIOD_DAYS,
    method: 'GET',
    responseSchema: PeriodDaysSchema,
  });

export const replacePeriodDays = (input: ReplacePeriodDays): Promise<PeriodDays> =>
  apiRequest({
    url: PERIOD_DAYS,
    method: 'PUT',
    body: input,
    bodySchema: ReplacePeriodDaysSchema,
    responseSchema: PeriodDaysSchema,
  });

export const getMoodLogs = (): Promise<MoodLogs> =>
  apiRequest({
    url: MOOD_LOGS,
    method: 'GET',
    responseSchema: MoodLogsSchema,
  });

export const replaceMoodLogs = (input: ReplaceMoodLogs): Promise<MoodLogs> =>
  apiRequest({
    url: MOOD_LOGS,
    method: 'PUT',
    body: input,
    bodySchema: ReplaceMoodLogsSchema,
    responseSchema: MoodLogsSchema,
  });

export const getSymptomCatalog = (): Promise<SymptomCatalog> =>
  apiRequest({
    url: SYMPTOM_CATALOG,
    method: 'GET',
    responseSchema: SymptomCatalogSchema,
  });

export const getSymptomLogs = (): Promise<SymptomLogs> =>
  apiRequest({
    url: SYMPTOM_LOGS,
    method: 'GET',
    responseSchema: SymptomLogsSchema,
  });

export const replaceSymptomLogs = (input: ReplaceSymptomLogs): Promise<SymptomLogs> =>
  apiRequest({
    url: SYMPTOM_LOGS,
    method: 'PUT',
    body: input,
    bodySchema: ReplaceSymptomLogsSchema,
    responseSchema: SymptomLogsSchema,
  });

export const getCustomSymptoms = (): Promise<CustomSymptoms> =>
  apiRequest({
    url: SYMPTOM_CUSTOM,
    method: 'GET',
    responseSchema: CustomSymptomsSchema,
  });

export const createCustomSymptom = (input: CreateCustomSymptom): Promise<CustomSymptom> =>
  apiRequest({
    url: SYMPTOM_CUSTOM,
    method: 'POST',
    body: input,
    bodySchema: CreateCustomSymptomSchema,
    responseSchema: CustomSymptomSchema,
  });

export const getSymptomFavorites = (): Promise<SymptomFavorites> =>
  apiRequest({
    url: SYMPTOM_FAVORITES,
    method: 'GET',
    responseSchema: SymptomFavoritesSchema,
  });

export const replaceSymptomFavorites = (
  input: ReplaceSymptomFavorites,
): Promise<SymptomFavorites> =>
  apiRequest({
    url: SYMPTOM_FAVORITES,
    method: 'PUT',
    body: input,
    bodySchema: ReplaceSymptomFavoritesSchema,
    responseSchema: SymptomFavoritesSchema,
  });

export const getCyclePhase = (): Promise<CyclePhaseSnapshotDto> =>
  apiRequest({
    url: CYCLE_PHASE,
    method: 'GET',
    responseSchema: CyclePhaseSnapshotSchema,
  });

export const registerPushToken = (
  input: RegisterPushToken,
): Promise<RegisterPushTokenResponse> =>
  apiRequest({
    url: NOTIFICATIONS_PUSH_TOKEN,
    method: 'PUT',
    body: input,
    bodySchema: RegisterPushTokenSchema,
    responseSchema: RegisterPushTokenResponseSchema,
  });

export const submitMrsIiAssessment = (
  input: SubmitMrsIiAssessment,
): Promise<MrsIiAssessmentSubmission> =>
  apiRequest({
    url: ASSESSMENTS_MRS_II,
    method: 'POST',
    body: input,
    bodySchema: SubmitMrsIiAssessmentSchema,
    responseSchema: MrsIiAssessmentSubmissionSchema,
  });

export const getLatestMrsIiAssessment = async (): Promise<MrsIiLatest> => {
  const response = await httpClient.get<MrsIiLatest>(ASSESSMENTS_MRS_II_LATEST);

  return parseMrsIiLatest(response.data);
};

export const submitPam13Assessment = (
  input: SubmitPam13Assessment,
): Promise<Pam13AssessmentSubmission> =>
  apiRequest({
    url: ASSESSMENTS_PAM_13,
    method: 'POST',
    body: input,
    bodySchema: SubmitPam13AssessmentSchema,
    responseSchema: Pam13AssessmentSubmissionSchema,
  });

export const getLatestPam13Assessment = (): Promise<Pam13Latest> =>
  apiRequest({
    url: ASSESSMENTS_PAM_13_LATEST,
    method: 'GET',
    responseSchema: Pam13LatestSchema,
  });

export const submitPhq2Assessment = (
  input: SubmitPhq2Assessment,
): Promise<Phq2AssessmentSubmission> =>
  apiRequest({
    url: ASSESSMENTS_PHQ_2,
    method: 'POST',
    body: input,
    bodySchema: SubmitPhq2AssessmentSchema,
    responseSchema: Phq2AssessmentSubmissionSchema,
  });

export const getLatestPhq2Assessment = (): Promise<Phq2Latest> =>
  apiRequest({
    url: ASSESSMENTS_PHQ_2_LATEST,
    method: 'GET',
    responseSchema: Phq2LatestSchema,
  });

export const getReportPreferences = (): Promise<ReportPreferences> =>
  apiRequest({
    url: REPORT_PREFERENCES,
    method: 'GET',
    responseSchema: ReportPreferencesSchema,
  });

export const putReportPreferences = (
  input: UpdateReportPreferences,
): Promise<ReportPreferences> =>
  apiRequest({
    url: REPORT_PREFERENCES,
    method: 'PUT',
    body: input,
    bodySchema: UpdateReportPreferencesSchema,
    responseSchema: ReportPreferencesSchema,
  });

export const getUserAppointment = (): Promise<UserAppointment> =>
  apiRequest({
    url: APPOINTMENTS_ME,
    method: 'GET',
    responseSchema: UserAppointmentSchema,
  });

export const putUserAppointment = (
  input: UpdateUserAppointment,
): Promise<UserAppointment> =>
  apiRequest({
    url: APPOINTMENTS_ME,
    method: 'PUT',
    body: input,
    bodySchema: UpdateUserAppointmentSchema,
    responseSchema: UserAppointmentSchema,
  });

export const deleteUserAppointment = (): Promise<UserAppointment> =>
  apiRequest({
    url: APPOINTMENTS_ME,
    method: 'DELETE',
    responseSchema: UserAppointmentSchema,
  });

export const getClinicalProfile = (): Promise<ClinicalProfile> =>
  apiRequest({
    url: CLINICAL_PROFILE_ME,
    method: 'GET',
    responseSchema: ClinicalProfileSchema,
  });

export const putClinicalProfile = (
  input: UpdateClinicalProfile,
): Promise<ClinicalProfile> =>
  apiRequest({
    url: CLINICAL_PROFILE_ME,
    method: 'PUT',
    body: input,
    bodySchema: UpdateClinicalProfileSchema,
    responseSchema: ClinicalProfileSchema,
  });

/** GPT-backed SYNA chat grounded in the authenticated user's health tools. */
export const postChat = (input: ChatRequest): Promise<ChatResponse> =>
  apiRequest({
    url: CHAT,
    method: 'POST',
    body: input,
    bodySchema: ChatRequestSchema,
    responseSchema: ChatResponseSchema,
    timeoutMs: 60_000,
  });

export { createApiClientError, isApiClientError, toApiClientError } from './http';
export type { ApiClientError } from './http';
