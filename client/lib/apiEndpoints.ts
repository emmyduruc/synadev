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

/** PATCH — replace summarized health metrics JSONB snapshot */
export const USERS_ME_HEALTH_METRICS = '/users/me/health-metrics';
export const USERS_ME_HEALTH_METRICS_ABSOLUTE = absolute(USERS_ME_HEALTH_METRICS);

// =============================================================================
// MENSTRUAL CYCLE / PERIOD
// =============================================================================

export const PERIOD_DAYS = '/period/days';
export const PERIOD_DAYS_ABSOLUTE = absolute(PERIOD_DAYS);

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
