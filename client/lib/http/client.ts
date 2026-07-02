import axios, { type InternalAxiosRequestConfig } from 'axios';

import { toApiClientError } from './errors';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach auth token here when authentication is added.
    // const token = getAccessToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: unknown) => Promise.reject(toApiClientError(error)),
);

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiClientError(error)),
);
