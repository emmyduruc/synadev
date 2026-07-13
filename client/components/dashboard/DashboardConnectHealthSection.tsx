import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { DASHBOARD_SURFACE } from '@/lib/dashboard/surfaces';
import type { HealthRawSnapshot } from '@/lib/health/types';
import { cn } from '@/lib/ui';

export type DashboardConnectHealthSectionProps = {
  healthSnapshot: HealthRawSnapshot | null;
  errorMessage: string | null;
  isConnecting: boolean;
  onConnect: () => void;
};

export const DashboardConnectHealthSection = ({
  healthSnapshot,
  errorMessage,
  isConnecting,
  onConnect,
}: DashboardConnectHealthSectionProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="md" className={cn(DASHBOARD_SURFACE.sageCard, 'p-5')}>
      <Box gap="sm">
        <Text size="2xl" weight="bold" align="center">
          {t('health_connect_title')}
        </Text>
        <Text size="sm" color="foreground-muted" align="center" className="leading-relaxed">
          {t('health_connect_subtitle')}
        </Text>
        <Button fullWidth size="lg" loading={isConnecting} onPress={onConnect}>
          {t('health_connect_button')}
        </Button>
        <Text size="2xs" color="foreground-muted" align="center" className="leading-relaxed">
          {t('health_connect_rebuild_hint')}
        </Text>
      </Box>

      {errorMessage ? (
        <Box className={cn(DASHBOARD_SURFACE.nestedLift, 'border-error-500/30 p-4')}>
          <Text size="sm" weight="semibold" color="error">
            {t('health_connect_error_title')}
          </Text>
          <Text size="xs" color="error" className="mt-2">
            {errorMessage}
          </Text>
        </Box>
      ) : null}

      {healthSnapshot ? (
        <Box gap="sm" className={cn(DASHBOARD_SURFACE.nestedLift, 'p-4')}>
          <Text size="sm" weight="semibold">
            {t('health_connect_raw_payload_title')}
          </Text>
          <Text size="2xs" color="foreground-muted">
            {t('health_connect_raw_payload_hint')}
          </Text>
          <Box className="rounded-xl bg-slate p-3">
            <Text
              size="2xs"
              color="white"
              responsive={false}
              className="font-mono leading-4">
              {JSON.stringify(healthSnapshot, null, 2)}
            </Text>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};
