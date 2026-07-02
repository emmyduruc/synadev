import {
  CreateUserSchema,
  HealthResponseSchema,
  UserSchema,
} from '@syna/shared-types';
import type { CreateUser, HealthResponse, User } from '@syna/shared-types';

import { apiRequest } from './http';

export const getHealth = (): Promise<HealthResponse> =>
  apiRequest({
    url: '/health',
    method: 'GET',
    responseSchema: HealthResponseSchema,
  });

export const createUser = (input: CreateUser): Promise<User> =>
  apiRequest({
    url: '/users',
    method: 'POST',
    body: input,
    bodySchema: CreateUserSchema,
    responseSchema: UserSchema,
  });

export const getUsers = (): Promise<User[]> =>
  apiRequest({
    url: '/users',
    method: 'GET',
    responseSchema: UserSchema.array(),
  });

export { createApiClientError, isApiClientError, toApiClientError } from './http';
export type { ApiClientError } from './http';
