import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { DASHBOARD_SURFACE } from '@/lib/dashboard/surfaces';
import {
  HEALTH_CONNECTION_ISSUE,
  HEALTH_CONNECTION_ISSUE_BODY_KEY,
  HEALTH_CONNECTION_ISSUE_TITLE_KEY,
  type HealthConnectionIssue,
} from '@/lib/health/healthConnectionIssue';
import { cn } from '@/lib/ui';

export type HealthConnectionIssueBannerProps = {
  issue: HealthConnectionIssue;
  canInstallHealthConnect: boolean;
  onInstallPress?: () => void;
};

export const HealthConnectionIssueBanner = ({
  issue,
  canInstallHealthConnect,
  onInstallPress,
}: HealthConnectionIssueBannerProps) => {
  const { t } = useTranslate();

  if (issue === HEALTH_CONNECTION_ISSUE.none) {
    return null;
  }

  return (
    <Box className={cn(DASHBOARD_SURFACE.nestedLift, 'gap-2 border-error-500/30 p-4')}>
      <Text size="sm" weight="semibold" color="error">
        {t(HEALTH_CONNECTION_ISSUE_TITLE_KEY[issue])}
      </Text>
      <Text size="xs" color="error" className="leading-relaxed">
        {t(HEALTH_CONNECTION_ISSUE_BODY_KEY[issue])}
      </Text>
      {canInstallHealthConnect && onInstallPress ? (
        <Button fullWidth size="sm" variant="secondary" onPress={onInstallPress}>
          {t('health_connect_issue_install_button')}
        </Button>
      ) : null}
    </Box>
  );
};
