import { useOAuth } from '@clerk/expo';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';

import { useTranslate } from '@/hooks/useTranslate';
import { AUTH_STRATEGY } from '@/lib/auth/constants';
import { getAuthErrorMessage } from '@/lib/auth/errors';
import { ROUTES } from '@/lib/routes';
import { toast } from '@/lib/sonner';

void WebBrowser.maybeCompleteAuthSession();

export const useSocialAuth = () => {
  const router = useRouter();
  const { t } = useTranslate();
  const googleOAuth = useOAuth({ strategy: AUTH_STRATEGY.google });
  const appleOAuth = useOAuth({ strategy: AUTH_STRATEGY.apple });
  const [isLoading, setIsLoading] = useState(false);

  const completeOAuth = async (
    startOAuthFlow: typeof googleOAuth.startOAuthFlow,
  ) => {
    setIsLoading(true);

    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
        toast.success(t('login_success_title'), {
          description: t('login_success_description'),
        });
        router.replace(ROUTES.home);
      }
    } catch (caught) {
      toast.error(getAuthErrorMessage(caught));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSocialLoading: isLoading,
    handleAppleAuth: () => completeOAuth(appleOAuth.startOAuthFlow),
    handleGoogleAuth: () => completeOAuth(googleOAuth.startOAuthFlow),
  };
};
