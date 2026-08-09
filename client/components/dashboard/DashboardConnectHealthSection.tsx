import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { DASHBOARD_SURFACE } from '@/lib/dashboard/surfaces';
import { cn } from '@/lib/ui';

export type DashboardConnectHealthSectionProps = {
  errorMessage: string | null;
  isConnecting: boolean;
  onConnect: () => void;
};

export const DashboardConnectHealthSection = ({
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
        <Text size="sm" color="foreground" align="center" className="leading-relaxed">
          {t('health_connect_subtitle')}
        </Text>
        <Button fullWidth size="lg" loading={isConnecting} onPress={onConnect}>
          {t('health_connect_button')}
        </Button>
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
    </Box>
  );
};
