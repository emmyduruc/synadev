import type { SignInFutureResource, SignUpFutureResource } from '@clerk/shared/types';
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

  const { error } = await auth.finalize({
    navigate: async ({ session }) => {
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
    },
  });

  if (error) {
    throw error;
  }
};
