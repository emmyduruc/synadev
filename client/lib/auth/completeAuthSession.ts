import type { SignInFutureResource, SignUpFutureResource } from '@clerk/shared/types';
import type { Href } from 'expo-router';

import { resolvePostAuthDestination } from '@/lib/auth/postAuthDestination';
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
   * Sign-up only: always open post-auth onboarding (bio → connect health →
   * permissions). Login still uses the DB / cache destination.
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

      // Navigate with our app routes directly. Clerk `decorateUrl` can remap to a
      // dashboard after-sign-up URL and skip bio / connect-health onboarding.
      if (requireOnboarding) {
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
