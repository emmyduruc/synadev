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

// =============================================================================
// MENSTRUAL CYCLE  (placeholder — wire when cycle API ships)
// =============================================================================

// export const CYCLE_LOGS = '/cycle/logs';
// export const CYCLE_LOGS_ABSOLUTE = absolute(CYCLE_LOGS);

// =============================================================================
// SYMPTOMS  (placeholder)
// =============================================================================

// export const SYMPTOM_LOGS = '/symptoms/logs';

// =============================================================================
// MOOD  (placeholder)
// =============================================================================

// export const MOOD_LOGS = '/mood/logs';

// =============================================================================
// HEALTH METRICS / WEARABLES  (placeholder)
// =============================================================================

// export const HEALTH_METRICS = '/health/metrics';
