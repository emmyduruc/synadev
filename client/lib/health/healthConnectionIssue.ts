import { HEALTH_READ_STATUS } from '@/lib/health/constants';
import {
  HEALTH_CONNECT_AVAILABILITY,
  type HealthConnectAvailability,
} from '@/lib/health/healthConnectAvailability';
import type { HealthRawSnapshot } from '@/lib/health/types';

/**
 * UI-facing Health Connect / health-link issue after a connect attempt or probe.
 * Components map these to localized copy (never show raw OEM/SDK strings).
 */
export const HEALTH_CONNECTION_ISSUE = {
  none: 'none',
  installRequired: 'install_required',
  unsupported: 'unsupported',
  unavailable: 'unavailable',
  error: 'error',
} as const;

export type HealthConnectionIssue =
  (typeof HEALTH_CONNECTION_ISSUE)[keyof typeof HEALTH_CONNECTION_ISSUE];

export const HEALTH_CONNECTION_ISSUE_TITLE_KEY = {
  [HEALTH_CONNECTION_ISSUE.installRequired]: 'health_connect_issue_install_title',
  [HEALTH_CONNECTION_ISSUE.unsupported]: 'health_connect_issue_unsupported_title',
  [HEALTH_CONNECTION_ISSUE.unavailable]: 'health_connect_issue_unavailable_title',
  [HEALTH_CONNECTION_ISSUE.error]: 'health_connect_issue_error_title',
} as const;

export const HEALTH_CONNECTION_ISSUE_BODY_KEY = {
  [HEALTH_CONNECTION_ISSUE.installRequired]: 'health_connect_issue_install_body',
  [HEALTH_CONNECTION_ISSUE.unsupported]: 'health_connect_issue_unsupported_body',
  [HEALTH_CONNECTION_ISSUE.unavailable]: 'health_connect_issue_unavailable_body',
  [HEALTH_CONNECTION_ISSUE.error]: 'health_connect_issue_error_body',
} as const;

export const issueFromHealthConnectAvailability = (
  availability: HealthConnectAvailability,
): HealthConnectionIssue => {
  if (availability === HEALTH_CONNECT_AVAILABILITY.available) {
    return HEALTH_CONNECTION_ISSUE.none;
  }

  if (availability === HEALTH_CONNECT_AVAILABILITY.providerUpdateRequired) {
    return HEALTH_CONNECTION_ISSUE.installRequired;
  }

  if (availability === HEALTH_CONNECT_AVAILABILITY.sdkUnavailable) {
    return HEALTH_CONNECTION_ISSUE.unsupported;
  }

  return HEALTH_CONNECTION_ISSUE.unavailable;
};

export const issueFromHealthSnapshot = (
  snapshot: HealthRawSnapshot,
): HealthConnectionIssue => {
  if (snapshot.status === HEALTH_READ_STATUS.connected) {
    return HEALTH_CONNECTION_ISSUE.none;
  }

  if (snapshot.unavailabilityReason) {
    return issueFromHealthConnectAvailability(snapshot.unavailabilityReason);
  }

  if (snapshot.status === HEALTH_READ_STATUS.unavailable) {
    return HEALTH_CONNECTION_ISSUE.unavailable;
  }

  if (snapshot.status === HEALTH_READ_STATUS.error) {
    return HEALTH_CONNECTION_ISSUE.error;
  }

  return HEALTH_CONNECTION_ISSUE.none;
};

export const shouldOfferHealthConnectInstall = (
  issue: HealthConnectionIssue,
): boolean => issue === HEALTH_CONNECTION_ISSUE.installRequired;
