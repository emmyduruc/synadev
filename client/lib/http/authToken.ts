import type { InternalAxiosRequestConfig } from 'axios';

type AccessTokenGetter = () => Promise<string | null>;

let accessTokenGetter: AccessTokenGetter | null = null;

/** Register Clerk `getToken` (or equivalent) from a React tree once auth is ready. */
export const setAccessTokenGetter = (getter: AccessTokenGetter | null): void => {
  accessTokenGetter = getter;
};

export const attachAuthorizationHeader = async (
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
  if (!accessTokenGetter) {
    return config;
  }

  const token = await accessTokenGetter();

  if (!token) {
    return config;
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
};
