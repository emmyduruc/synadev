import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { useProfileHealthConnection } from '@/hooks/useProfileHealthConnection';
import { useTranslate } from '@/hooks/useTranslate';
import { isHealthConnected, loadHealthConnectionSummary } from '@/lib/health/healthConnectionSummary';
import {
  HEALTH_PERMISSION_IDS,
  type HealthPermissionId,
} from '@/lib/health/healthPermissions';
import { ROUTES } from '@/lib/routes';
import { toast } from '@/lib/sonner';

const createEnabledMap = (enabled: boolean): Record<HealthPermissionId, boolean> =>
  Object.fromEntries(
    HEALTH_PERMISSION_IDS.map((id) => [id, enabled]),
  ) as Record<HealthPermissionId, boolean>;

export const useHealthPermissionsOnboarding = () => {
  const router = useRouter();
  const { t } = useTranslate();
  const { isConnecting, connectHealth } = useProfileHealthConnection();
  const [enabledById, setEnabledById] = useState<Record<HealthPermissionId, boolean>>(
    () => createEnabledMap(true),
  );

  const hasAnyEnabled = useMemo(
    () => HEALTH_PERMISSION_IDS.some((id) => enabledById[id]),
    [enabledById],
  );

  const togglePermission = useCallback((id: HealthPermissionId) => {
    setEnabledById((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  }, []);

  const setAllPermissions = useCallback((enabled: boolean) => {
    setEnabledById(createEnabledMap(enabled));
  }, []);

  const allowAccess = useCallback(async () => {
    if (!hasAnyEnabled) {
      toast.error(t('health_permission_none_selected_error'));
      return;
    }

    await connectHealth();
    const summary = await loadHealthConnectionSummary();

    if (isHealthConnected(summary)) {
      router.replace(ROUTES.home);
      return;
    }

    toast.error(t('connect_health_connect_error'));
  }, [connectHealth, hasAnyEnabled, router, t]);

  return {
    enabledById,
    hasAnyEnabled,
    isConnecting,
    togglePermission,
    setAllPermissions,
    allowAccess,
  };
};
