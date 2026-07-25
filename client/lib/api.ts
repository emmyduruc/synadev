import {
  HealthResponseSchema,
  UpdateUserProfileSchema,
  UserSchema,
} from '@syna/shared-types';
import type { HealthResponse, UpdateUserProfile, User } from '@syna/shared-types';

import { HEALTH, USERS_ME } from './apiEndpoints';
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

export { createApiClientError, isApiClientError, toApiClientError } from './http';
export type { ApiClientError } from './http';
