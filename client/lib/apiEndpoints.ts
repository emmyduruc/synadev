/**
 * Central API endpoint declarations.
 * Paths are relative to `API_BASE_URL` (Axios `baseURL`).
 * Absolute helpers are provided for logging / non-Axios callers.
 */

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

const absolute = (path: string): string => `${API_BASE_URL}${path}`;

// =============================================================================
// HEALTH
// =============================================================================

export const HEALTH = '/health';
export const HEALTH_ABSOLUTE = absolute(HEALTH);

// =============================================================================
// USER
// =============================================================================

/** GET — provision + return the authenticated user */
export const USERS_ME = '/users/me';
export const USERS_ME_ABSOLUTE = absolute(USERS_ME);

/** PATCH — update bio profile (firstName, lastName, dateOfBirth, address?) */
export const USERS_ME_UPDATE = USERS_ME;

/** PATCH — update preferred locale for emails / push */
export const USERS_ME_LOCALE = '/users/me/locale';
export const USERS_ME_LOCALE_ABSOLUTE = absolute(USERS_ME_LOCALE);

/** PATCH — replace summarized health metrics JSONB snapshot */
export const USERS_ME_HEALTH_METRICS = '/users/me/health-metrics';
export const USERS_ME_HEALTH_METRICS_ABSOLUTE = absolute(USERS_ME_HEALTH_METRICS);

/** PATCH — replace clinical health-record JSONB document */
export const USERS_ME_HEALTH_RECORD = '/users/me/health-record';
export const USERS_ME_HEALTH_RECORD_ABSOLUTE = absolute(USERS_ME_HEALTH_RECORD);

/** GET/PUT — per-day wearable aggregates for Patterns */
export const HEALTH_DAILY = '/health/daily';
export const HEALTH_DAILY_ABSOLUTE = absolute(HEALTH_DAILY);

// =============================================================================
// MENSTRUAL CYCLE / PERIOD
// =============================================================================

export const PERIOD_DAYS = '/period/days';
export const PERIOD_DAYS_ABSOLUTE = absolute(PERIOD_DAYS);

export const CYCLE_PHASE = '/cycle/phase';
export const CYCLE_PHASE_ABSOLUTE = absolute(CYCLE_PHASE);

// =============================================================================
// SYMPTOMS
// =============================================================================

export const SYMPTOM_CATALOG = '/symptoms/catalog';
export const SYMPTOM_CATALOG_ABSOLUTE = absolute(SYMPTOM_CATALOG);
export const SYMPTOM_LOGS = '/symptoms/logs';
export const SYMPTOM_LOGS_ABSOLUTE = absolute(SYMPTOM_LOGS);

// =============================================================================
// MOOD
// =============================================================================

export const MOOD_LOGS = '/mood/logs';
export const MOOD_LOGS_ABSOLUTE = absolute(MOOD_LOGS);

// =============================================================================
// ASSESSMENTS (MRS-II / PAM-13 / PHQ-2)
// =============================================================================

export const ASSESSMENTS_MRS_II = '/assessments/mrs-ii';
export const ASSESSMENTS_MRS_II_ABSOLUTE = absolute(ASSESSMENTS_MRS_II);
export const ASSESSMENTS_MRS_II_LATEST = '/assessments/mrs-ii/latest';
export const ASSESSMENTS_MRS_II_LATEST_ABSOLUTE = absolute(ASSESSMENTS_MRS_II_LATEST);

export const ASSESSMENTS_PAM_13 = '/assessments/pam-13';
export const ASSESSMENTS_PAM_13_ABSOLUTE = absolute(ASSESSMENTS_PAM_13);
export const ASSESSMENTS_PAM_13_LATEST = '/assessments/pam-13/latest';
export const ASSESSMENTS_PAM_13_LATEST_ABSOLUTE = absolute(ASSESSMENTS_PAM_13_LATEST);

export const ASSESSMENTS_PHQ_2 = '/assessments/phq-2';
export const ASSESSMENTS_PHQ_2_ABSOLUTE = absolute(ASSESSMENTS_PHQ_2);
export const ASSESSMENTS_PHQ_2_LATEST = '/assessments/phq-2/latest';
export const ASSESSMENTS_PHQ_2_LATEST_ABSOLUTE = absolute(ASSESSMENTS_PHQ_2_LATEST);

// =============================================================================
// NOTIFICATIONS
// =============================================================================

export const NOTIFICATIONS_PUSH_TOKEN = '/notifications/push-token';
export const NOTIFICATIONS_PUSH_TOKEN_ABSOLUTE = absolute(NOTIFICATIONS_PUSH_TOKEN);
