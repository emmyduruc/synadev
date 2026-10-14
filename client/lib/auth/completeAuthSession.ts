import type {
  SessionResource,
  SignInFutureResource,
  SignUpFutureResource,
} from '@clerk/shared/types';
import type { Href } from 'expo-router';

import { resolvePostAuthDestination } from '@/lib/auth/postAuthDestination';
import { clearHealthOnboardingCompleted } from '@/lib/onboarding/healthOnboardingStorage';
import { clearNotificationOnboardingCompleted } from '@/lib/onboarding/notificationOnboardingStorage';
import { ROUTES } from '@/lib/routes';
import { toast } from '@/lib/sonner';

type AuthRouter = {
  replace: (href: Href) => void;
};

type FinalizableAuthSession = SignInFutureResource | SignUpFutureResource;

export type CompleteAuthSessionOptions = {
  router: AuthRouter;
  successTitle: string;
  successDescription?: string;
  /**
   * Sign-up only: reset connect-health progress and open post-auth onboarding
   * (bio → connect health → permissions). Login uses the normal destination.
   */
  requireOnboarding?: boolean;
};

export const completeAuthSession = async (
  auth: FinalizableAuthSession,
  {
    router,
    successTitle,
    successDescription,
    requireOnboarding = false,
  }: CompleteAuthSessionOptions,
): Promise<void> => {
  if (auth.status !== 'complete') {
    throw new Error('Authentication is not complete.');
  }

  let activeSession: SessionResource | null = null;

  // Clerk clears session/user (useAuth → isLoaded: false) for the whole duration
  // of `navigate`, and only restores them after it resolves. Keep this callback
  // synchronous and route afterwards, so we never navigate (or wait on the
  // network) while auth-gated layouts are in that transitive state.
  const { error } = await auth.finalize({
    navigate: ({ session }) => {
      activeSession = session;
    },
  });

  if (error) {
    throw error;
  }

  const session = activeSession as SessionResource | null;

  if (session?.currentTask) {
    return;
  }

  toast.success(successTitle, {
    description: successDescription,
  });

  if (requireOnboarding) {
    // New account must see bio → health → notifications, even if a previous
    // install marked those steps complete on this device.
    await Promise.all([
      clearHealthOnboardingCompleted(),
      clearNotificationOnboardingCompleted(),
    ]);
    router.replace(ROUTES.onboarding.bioData);
    return;
  }

  const destination = await resolvePostAuthDestination(session?.user?.id);
  router.replace(destination);
};
