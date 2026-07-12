import type { SignInFutureResource, SignUpFutureResource } from '@clerk/shared/types';
import type { Href } from 'expo-router';

import { resolvePostAuthDestination } from '@/lib/auth/postAuthDestination';
import { toast } from '@/lib/sonner';

type AuthRouter = {
  replace: (href: Href) => void;
};

type FinalizableAuthSession = SignInFutureResource | SignUpFutureResource;

export type CompleteAuthSessionOptions = {
  router: AuthRouter;
  successTitle: string;
  successDescription?: string;
};

export const completeAuthSession = async (
  auth: FinalizableAuthSession,
  { router, successTitle, successDescription }: CompleteAuthSessionOptions,
): Promise<void> => {
  if (auth.status !== 'complete') {
    throw new Error('Authentication is not complete.');
  }

  const { error } = await auth.finalize({
    navigate: async ({ session, decorateUrl }) => {
      if (session?.currentTask) {
        return;
      }

      toast.success(successTitle, {
        description: successDescription,
      });

      const destination = await resolvePostAuthDestination();
      router.replace(decorateUrl(destination as string) as Href);
    },
  });

  if (error) {
    throw error;
  }
};
