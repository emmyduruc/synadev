import type { SignInFutureResource, SignUpFutureResource } from '@clerk/shared/types';
import type { Href } from 'expo-router';

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
};

export const completeAuthSession = async (
  auth: FinalizableAuthSession,
  { router, successTitle, successDescription }: CompleteAuthSessionOptions,
): Promise<void> => {
  if (auth.status !== 'complete') {
    throw new Error('Authentication is not complete.');
  }

  const { error } = await auth.finalize({
    navigate: ({ session, decorateUrl }) => {
      if (session?.currentTask) {
        return;
      }

      toast.success(successTitle, {
        description: successDescription,
      });

      router.replace(decorateUrl(ROUTES.home) as Href);
    },
  });

  if (error) {
    throw error;
  }
};
