import Constants from 'expo-constants';

type ClerkExtra = {
  clerkPublishableKey?: string;
};

const getPublishableKeyFromExtra = (): string | undefined => {
  const extra = Constants.expoConfig?.extra as ClerkExtra | undefined;
  return extra?.clerkPublishableKey;
};

export const getClerkPublishableKey = (): string => {
  // Must use a literal key — Expo inlines `process.env.EXPO_PUBLIC_*` at build time.
  const publishableKey =
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? getPublishableKeyFromExtra();

  if (!publishableKey) {
    throw new Error(
      'Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add it to the repo root .env file.',
    );
  }

  return publishableKey;
};
