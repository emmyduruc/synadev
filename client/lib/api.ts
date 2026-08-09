import {
  CyclePhaseSnapshotSchema,
  HealthDailyMetricsSchema,
  HealthResponseSchema,
  MoodLogsSchema,
  MrsIiAssessmentSubmissionSchema,
  MrsIiLatestSchema,
  Pam13AssessmentSubmissionSchema,
  Pam13LatestSchema,
  PeriodDaysSchema,
  RegisterPushTokenResponseSchema,
  RegisterPushTokenSchema,
  ReplaceMoodLogsSchema,
  ReplacePeriodDaysSchema,
  ReplaceSymptomLogsSchema,
  SubmitMrsIiAssessmentSchema,
  SubmitPam13AssessmentSchema,
  SymptomCatalogSchema,
  SymptomLogsSchema,
  UpdateUserHealthMetricsSchema,
  UpdateUserLocaleSchema,
  UpdateUserProfileSchema,
  UpsertHealthDailyMetricsSchema,
  UserSchema,
} from '@syna/shared-types';
import type {
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
  RegisterPushToken,
  RegisterPushTokenResponse,
  ReplaceMoodLogs,
  ReplacePeriodDays,
  ReplaceSymptomLogs,
  SubmitMrsIiAssessment,
  SubmitPam13Assessment,
  SymptomCatalog,
  SymptomLogs,
  UpdateUserHealthMetrics,
  UpdateUserLocale,
  UpdateUserProfile,
  UpsertHealthDailyMetrics,
  User,
} from '@syna/shared-types';

import {
  ASSESSMENTS_MRS_II,
  ASSESSMENTS_MRS_II_LATEST,
  ASSESSMENTS_PAM_13,
  ASSESSMENTS_PAM_13_LATEST,
  CYCLE_PHASE,
  HEALTH,
  HEALTH_DAILY,
  MOOD_LOGS,
  NOTIFICATIONS_PUSH_TOKEN,
  PERIOD_DAYS,
  SYMPTOM_CATALOG,
  SYMPTOM_LOGS,
  USERS_ME,
  USERS_ME_HEALTH_METRICS,
  USERS_ME_LOCALE,
} from './apiEndpoints';
import { apiRequest } from './http';

export const getHealth = (): Promise<HealthResponse> =>
  apiRequest({
    url: HEALTH,
    method: 'GET',
    responseSchema: HealthResponseSchema,
  });

/** Provisions the Syna user row on first call, then returns the profile. */
export const getCurrentUser = (): Promise<User> =>
  apiRequest({
    url: USERS_ME,
    method: 'GET',
    responseSchema: UserSchema,
  });

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

export const getLatestMrsIiAssessment = (): Promise<MrsIiLatest> =>
  apiRequest({
    url: ASSESSMENTS_MRS_II_LATEST,
    method: 'GET',
    responseSchema: MrsIiLatestSchema,
  });

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

export { createApiClientError, isApiClientError, toApiClientError } from './http';
export type { ApiClientError } from './http';
