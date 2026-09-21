import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { useProfileHealthConnection } from '@/hooks/useProfileHealthConnection';
import { useTranslate } from '@/hooks/useTranslate';
import { isHealthConnected, loadHealthConnectionSummary } from '@/lib/health/healthConnectionSummary';
import { ROUTES } from '@/lib/routes';
import { toast } from '@/lib/sonner';

export const useHealthPermissionsOnboarding = () => {
  const router = useRouter();
  const { t } = useTranslate();
  const { isConnecting, connectHealth } = useProfileHealthConnection();

  const allowAccess = useCallback(async () => {
    await connectHealth();
    const summary = await loadHealthConnectionSummary();

    if (isHealthConnected(summary)) {
      router.replace(ROUTES.home);
      return;
    }

    toast.error(t('connect_health_connect_error'));
  }, [connectHealth, router, t]);

  return {
    isConnecting,
    allowAccess,
  };
};
