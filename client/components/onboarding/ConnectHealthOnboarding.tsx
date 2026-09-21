import { AuthGradientLayout } from '@/components/auth/AuthGradientLayout';
import { ConnectHealthBenefitCard } from '@/components/onboarding/ConnectHealthBenefitCard';
import { Box, Button, ScreenHero, Text } from '@/components/ui';
import { ActivityIcon } from '@/components/ui/icons/ActivityIcon';
import { HeartIcon } from '@/components/ui/icons/HeartIcon';
import { SleepIcon } from '@/components/ui/icons/SleepIcon';
import { useConnectHealthOnboarding } from '@/hooks/useConnectHealthOnboarding';
import { useTranslate } from '@/hooks/useTranslate';
import { ROUTES } from '@/lib/routes';
import { semanticColors } from '@/lib/ui';

const ICON_SIZE = 22;

export const ConnectHealthOnboarding = () => {
  const { t } = useTranslate();
  const { openHealthPermissions, continueWithoutHealthData } =
    useConnectHealthOnboarding();
  const iconColor = semanticColors.foreground;
  const softButtonStyle = { backgroundColor: semanticColors.report.dataBackground };

  return (
    <AuthGradientLayout
      header={{ title: '', fallbackHref: ROUTES.onboarding.bioData }}
      footer={(
        <Box gap="sm" paddingX="lg">
          <Button fullWidth size="lg" onPress={openHealthPermissions}>
            {t('connect_health_primary_button')}
          </Button>
          <Button
            fullWidth
            size="lg"
            variant="outline"
            onPress={continueWithoutHealthData}
            style={softButtonStyle}
            className="border-0"
            textClassName="text-foreground"
          >
            {t('connect_health_skip_button')}
          </Button>
          <Text size="xs" color="foreground" align="center" className="mt-1">
            {t('connect_health_footer_note')}
          </Text>
        </Box>
      )}
    >
      <ScreenHero
        headline={t('connect_health_headline')}
        bodyLines={[t('connect_health_body_primary'), t('connect_health_body_secondary')]}
      />

      <Box gap="md">
        <ConnectHealthBenefitCard
          icon={<SleepIcon size={ICON_SIZE} color={iconColor} />}
          title={t('connect_health_sleep_title')}
          description={t('connect_health_sleep_description')}
          highlight={t('connect_health_card_highlight')}
        />
        <ConnectHealthBenefitCard
          icon={<HeartIcon size={ICON_SIZE} color={iconColor} />}
          title={t('connect_health_heart_title')}
          description={t('connect_health_heart_description')}
          highlight={t('connect_health_card_highlight')}
        />
        <ConnectHealthBenefitCard
          icon={<ActivityIcon size={ICON_SIZE} color={iconColor} />}
          title={t('connect_health_activity_title')}
          description={t('connect_health_activity_description')}
        />

        <Text size="sm" color="foreground" className="mt-2 leading-relaxed">
          {t('connect_health_decision_body')}
        </Text>
      </Box>
    </AuthGradientLayout>
  );
};
