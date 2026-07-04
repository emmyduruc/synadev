export const CLERK_PUBLISHABLE_KEY_ENV = 'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY';

export const getClerkPublishableKey = (): string => {
  const publishableKey = process.env[CLERK_PUBLISHABLE_KEY_ENV];

  if (!publishableKey) {
    throw new Error(
      'Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add it to the repo root .env file.',
    );
  }

  return publishableKey;
};
