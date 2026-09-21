import { AuthGradientLayout } from '@/components/auth/AuthGradientLayout';
import { HealthPermissionToggleRow } from '@/components/onboarding/HealthPermissionToggleRow';
import { Box, Button, Text, TouchableOpacity } from '@/components/ui';
import { HeartIcon } from '@/components/ui/icons/HeartIcon';
import { useHealthPermissionsOnboarding } from '@/hooks/useHealthPermissionsOnboarding';
import { useTranslate } from '@/hooks/useTranslate';
import {
  HEALTH_PERMISSION_IDS,
  HEALTH_PERMISSION_LABEL_KEY,
} from '@/lib/health/healthPermissions';
import { ROUTES } from '@/lib/routes';
import { semanticColors } from '@/lib/ui';

export const HealthPermissionsOnboarding = () => {
  const { t } = useTranslate();
  const {
    enabledById,
    hasAnyEnabled,
    isConnecting,
    togglePermission,
    setAllPermissions,
    allowAccess,
  } = useHealthPermissionsOnboarding();

  return (
    <AuthGradientLayout
      header={{ title: '', fallbackHref: ROUTES.onboarding.connectHealth }}
      footer={(
        <Box paddingX="lg">
          <Button
            fullWidth
            size="lg"
            loading={isConnecting}
            disabled={!hasAnyEnabled}
            onPress={allowAccess}
          >
            {t('health_permission_allow_button')}
          </Button>
        </Box>
      )}
    >
      <Box align="center" className="mb-8 mt-4">
        <Box
          align="center"
          justify="center"
          className="mb-4 h-16 w-16 rounded-2xl"
          style={{ backgroundColor: semanticColors.ovum.dustyRoseLight }}
        >
          <HeartIcon size={28} color={semanticColors.foreground} />
        </Box>
        <Text size="3xl" weight="bold" color="primary" className="tracking-[0.18em]">
          {t('health_permission_brand')}
        </Text>
        <Text size="base" align="center" className="mt-3 px-2 leading-relaxed text-foreground">
          {t('health_permission_prompt')}
        </Text>
      </Box>

      <TouchableOpacity
        accessibilityRole="button"
        className="mb-5 self-center"
        onPress={() => setAllPermissions(!hasAnyEnabled)}
      >
        <Text size="base" weight="semibold" color="primary">
          {hasAnyEnabled
            ? t('health_permission_disable_all')
            : t('health_permission_enable_all')}
        </Text>
      </TouchableOpacity>

      <Text size="sm" color="foreground-muted" className="mb-2">
        {t('health_permission_list_heading')}
      </Text>

      <Box
        paddingX="lg"
        rounded="2xl"
        className="border border-border bg-white/90"
      >
        {HEALTH_PERMISSION_IDS.map((id, index) => (
          <HealthPermissionToggleRow
            key={id}
            label={t(HEALTH_PERMISSION_LABEL_KEY[id])}
            value={enabledById[id]}
            disabled={isConnecting}
            showDivider={index < HEALTH_PERMISSION_IDS.length - 1}
            onValueChange={() => togglePermission(id)}
          />
        ))}
      </Box>
    </AuthGradientLayout>
  );
};
