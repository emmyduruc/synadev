import {
  CyclePhaseSnapshotSchema,
  HealthResponseSchema,
  MoodLogsSchema,
  PeriodDaysSchema,
  RegisterPushTokenResponseSchema,
  RegisterPushTokenSchema,
  ReplaceMoodLogsSchema,
  ReplacePeriodDaysSchema,
  ReplaceSymptomLogsSchema,
  SymptomCatalogSchema,
  SymptomLogsSchema,
  UpdateUserHealthMetricsSchema,
  UpdateUserLocaleSchema,
  UpdateUserProfileSchema,
  UserSchema,
} from '@syna/shared-types';
import type {
  CyclePhaseSnapshotDto,
  HealthResponse,
  MoodLogs,
  PeriodDays,
  RegisterPushToken,
  RegisterPushTokenResponse,
  ReplaceMoodLogs,
  ReplacePeriodDays,
  ReplaceSymptomLogs,
  SymptomCatalog,
  SymptomLogs,
  UpdateUserHealthMetrics,
  UpdateUserLocale,
  UpdateUserProfile,
  User,
} from '@syna/shared-types';

import {
  CYCLE_PHASE,
  HEALTH,
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

export { createApiClientError, isApiClientError, toApiClientError } from './http';
export type { ApiClientError } from './http';
