import axios, { type InternalAxiosRequestConfig } from 'axios';

import { attachAuthorizationHeader } from './authToken';
import { toApiClientError } from './errors';

import { API_BASE_URL } from '@/lib/apiEndpoints';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => attachAuthorizationHeader(config),
  (error: unknown) => Promise.reject(toApiClientError(error)),
);

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiClientError(error)),
);
