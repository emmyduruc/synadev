import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { useProfileHealthConnection } from '@/hooks/useProfileHealthConnection';
import { useTranslate } from '@/hooks/useTranslate';
import {
  isHealthConnected,
  loadHealthConnectionSummary,
} from '@/lib/health/healthConnectionSummary';
import { setHealthOnboardingCompleted } from '@/lib/onboarding/healthOnboardingStorage';
import { ROUTES } from '@/lib/routes';
import { toast } from '@/lib/sonner';

/**
 * Health permission step: Allow runs the same HealthKit / Health Connect connect
 * flow as the home dashboard, then stays here so the user can Proceed.
 */
export const useHealthPermissionsOnboarding = () => {
  const router = useRouter();
  const { t } = useTranslate();
  const { isConnecting, isConnected, connectHealth, refreshSummary } =
    useProfileHealthConnection();

  const proceed = useCallback(async () => {
    await setHealthOnboardingCompleted();
    router.replace(ROUTES.onboarding.notifications);
  }, [router]);

  const handlePrimaryAction = useCallback(async () => {
    if (isConnected) {
      await proceed();
      return;
    }

    // Same device connect path as home → DashboardSetupProgress.
    await connectHealth();
    await refreshSummary();

    const summary = await loadHealthConnectionSummary();

    if (!isHealthConnected(summary)) {
      toast.error(t('connect_health_connect_error'));
    }
  }, [connectHealth, isConnected, proceed, refreshSummary, t]);

  return {
    isConnecting,
    isConnected,
    handlePrimaryAction,
  };
};
