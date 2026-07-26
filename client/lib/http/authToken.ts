import type { InternalAxiosRequestConfig } from 'axios';

type AccessTokenGetter = () => Promise<string | null>;

let accessTokenGetter: AccessTokenGetter | null = null;

const ACCESS_TOKEN_WAIT_ATTEMPTS = 20;
const ACCESS_TOKEN_WAIT_DELAY_MS = 100;

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

/** Register Clerk `getToken` (or equivalent) from a React tree once auth is ready. */
export const setAccessTokenGetter = (getter: AccessTokenGetter | null): void => {
  accessTokenGetter = getter;
};

/**
 * Waits briefly for a Clerk session token after sign-in / setActive.
 * Prevents unauthenticated `/users/me` calls that falsely send users to bio onboarding.
 */
export const waitForAccessToken = async (
  attempts = ACCESS_TOKEN_WAIT_ATTEMPTS,
  delayMs = ACCESS_TOKEN_WAIT_DELAY_MS,
): Promise<string | null> => {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (accessTokenGetter) {
      const token = await accessTokenGetter();

      if (token) {
        return token;
      }
    }

    await delay(delayMs);
  }

  return null;
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
