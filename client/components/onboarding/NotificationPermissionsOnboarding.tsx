import { AuthGradientLayout } from '@/components/auth/AuthGradientLayout';
import { NotificationPermissionRow } from '@/components/onboarding/NotificationPermissionRow';
import { Box, Button, Text } from '@/components/ui';
import { BellIcon } from '@/components/ui/icons/BellIcon';
import { useNotificationPermissionsOnboarding } from '@/hooks/useNotificationPermissionsOnboarding';
import { useTranslate } from '@/hooks/useTranslate';
import { ROUTES } from '@/lib/routes';
import { semanticColors } from '@/lib/ui';

const NOTIFICATION_REASON_KEYS = [
  {
    titleKey: 'notification_permission_reminders_title',
    descriptionKey: 'notification_permission_reminders_description',
  },
  {
    titleKey: 'notification_permission_cycle_title',
    descriptionKey: 'notification_permission_cycle_description',
  },
  {
    titleKey: 'notification_permission_insights_title',
    descriptionKey: 'notification_permission_insights_description',
  },
] as const;

export const NotificationPermissionsOnboarding = () => {
  const { t } = useTranslate();
  const {
    isRequesting,
    allowNotifications,
    // continueWithoutNotifications,
  } = useNotificationPermissionsOnboarding();
  // const softButtonStyle = { backgroundColor: semanticColors.report.dataBackground };

  return (
    <AuthGradientLayout
      header={{ title: '', fallbackHref: ROUTES.onboarding.healthPermissions }}
      footer={(
        <Box gap="sm" paddingX="lg">
          <Button
            fullWidth
            size="lg"
            loading={isRequesting}
            onPress={() => {
              void allowNotifications();
            }}
          >
            {t('notification_permission_allow_button')}
          </Button>
          {/* Skip disabled for now — notification permission is required onboarding.
          <Button
            fullWidth
            size="lg"
            variant="outline"
            disabled={isRequesting}
            onPress={() => {
              void continueWithoutNotifications();
            }}
            style={softButtonStyle}
            className="border-0"
            textClassName="text-foreground"
          >
            {t('notification_permission_skip_button')}
          </Button>
          */}
        </Box>
      )}
    >
      <Box align="center" className="mb-8 mt-2">
        <Box
          align="center"
          justify="center"
          className="mb-4 h-20 w-20 rounded-3xl bg-white"
          style={{ backgroundColor: semanticColors.report.dataBackground }}
        >
          <BellIcon
            size={36}
            color={semanticColors.foreground}
            accentColor={semanticColors.report.bleeding}
          />
        </Box>
        <Text size="xl" weight="semibold" color="primary" className="tracking-[0.18em]">
          {t('notification_permission_brand')}
        </Text>
        <Text size="base" color="foreground" align="center" className="mt-3 px-2 leading-relaxed">
          {t('notification_permission_prompt')}
        </Text>
        <Text size="sm" color="foreground-muted" align="center" className="mt-3 px-2 leading-relaxed">
          {t('notification_permission_body')}
        </Text>
      </Box>

      <Text size="sm" color="foreground" className="mb-2">
        {t('notification_permission_list_heading')}
      </Text>

      <Box paddingX="lg" rounded="xl" className="border border-border bg-white/90">
        {NOTIFICATION_REASON_KEYS.map((item, index) => (
          <NotificationPermissionRow
            key={item.titleKey}
            title={t(item.titleKey)}
            description={t(item.descriptionKey)}
            showDivider={index < NOTIFICATION_REASON_KEYS.length - 1}
          />
        ))}
      </Box>
    </AuthGradientLayout>
  );
};
