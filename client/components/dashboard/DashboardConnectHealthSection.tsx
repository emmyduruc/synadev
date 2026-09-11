import { HealthConnectionIssueBanner } from '@/components/health/HealthConnectionIssueBanner';
import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { DASHBOARD_SURFACE } from '@/lib/dashboard/surfaces';
import type { HealthConnectionIssue } from '@/lib/health/healthConnectionIssue';
import { cn } from '@/lib/ui';

export type DashboardConnectHealthSectionProps = {
  healthIssue: HealthConnectionIssue;
  canInstallHealthConnect: boolean;
  isConnecting: boolean;
  onConnect: () => void;
  onInstallHealthConnect: () => void;
};

export const DashboardConnectHealthSection = ({
  healthIssue,
  canInstallHealthConnect,
  isConnecting,
  onConnect,
  onInstallHealthConnect,
}: DashboardConnectHealthSectionProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="md" className={cn(DASHBOARD_SURFACE.sageCard, 'p-5')}>
      <Box gap="sm">
        <Text size="2xl" weight="bold" align="center">
          {t('health_connect_title')}
        </Text>
        <Text size="sm" color="foreground" align="center" className="leading-relaxed">
          {t('health_connect_subtitle')}
        </Text>
        <Button fullWidth size="lg" loading={isConnecting} onPress={onConnect}>
          {t('health_connect_button')}
        </Button>
      </Box>

      <HealthConnectionIssueBanner
        issue={healthIssue}
        canInstallHealthConnect={canInstallHealthConnect}
        onInstallPress={onInstallHealthConnect}
      />
    </Box>
  );
};
