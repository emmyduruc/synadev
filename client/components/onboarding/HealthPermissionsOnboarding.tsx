import { AuthGradientLayout } from '@/components/auth/AuthGradientLayout';
import { HealthPermissionToggleRow } from '@/components/onboarding/HealthPermissionToggleRow';
import { Box, Button, Text } from '@/components/ui';
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
  const { isConnecting, isConnected, handlePrimaryAction } =
    useHealthPermissionsOnboarding();

  const primaryLabel = isConnected
    ? t('health_permission_proceed_button')
    : t('health_permission_allow_button');

  return (
    <AuthGradientLayout
      header={{ title: '', fallbackHref: ROUTES.onboarding.connectHealth }}
      footer={(
        <Box paddingX="lg">
          <Button
            fullWidth
            size="lg"
            loading={isConnecting}
            onPress={() => {
              void handlePrimaryAction();
            }}
          >
            {primaryLabel}
          </Button>
        </Box>
      )}
    >
      <Box align="center" className="mb-8 mt-2">
        <Box
          align="center"
          justify="center"
          className="mb-4 h-16 w-16 rounded-2xl bg-white"
        >
          <HeartIcon size={28} color={semanticColors.foreground} />
        </Box>
        <Text size="xl" weight="semibold" color="primary" className="tracking-[0.18em]">
          {t('health_permission_brand')}
        </Text>
        <Text size="base" color="foreground" align="center" className="mt-3 px-2 leading-relaxed">
          {isConnected
            ? t('health_permission_connected_prompt')
            : t('health_permission_prompt')}
        </Text>
        {isConnected ? (
          <Text
            size="sm"
            weight="semibold"
            align="center"
            className="mt-3 px-2"
            style={{ color: semanticColors.report.bleeding }}
          >
            {t('health_permission_connected_badge')}
          </Text>
        ) : null}
      </Box>

      <Text size="sm" color="foreground" className="mb-2">
        {t('health_permission_list_heading')}
      </Text>

      <Box paddingX="lg" rounded="xl" className="border border-border bg-white/90">
        {HEALTH_PERMISSION_IDS.map((id, index) => (
          <HealthPermissionToggleRow
            key={id}
            label={t(HEALTH_PERMISSION_LABEL_KEY[id])}
            showDivider={index < HEALTH_PERMISSION_IDS.length - 1}
          />
        ))}
      </Box>
    </AuthGradientLayout>
  );
};
