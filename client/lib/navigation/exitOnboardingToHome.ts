import type { Href } from 'expo-router';

import { ROUTES } from '@/lib/routes';

type DismissableRouter = {
  canDismiss: () => boolean;
  dismissAll: () => void;
  replace: (href: Href) => void;
};

/**
 * Leaves post-auth onboarding and lands on the real tab home.
 * Onboarding was historically presented as fullScreenModal; a plain
 * `replace(home)` then stacks tabs as another sheet over connect-health.
 */
export const exitOnboardingToHome = (router: DismissableRouter): void => {
  if (router.canDismiss()) {
    router.dismissAll();
  }

  router.replace(ROUTES.home);
};
