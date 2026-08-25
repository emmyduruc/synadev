import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';

export type UserReportBrandHeaderProps = {
  firstName: string | null;
  trackedDays: number;
};

export const UserReportBrandHeader = ({
  firstName,
  trackedDays,
}: UserReportBrandHeaderProps) => {
  const { t } = useTranslate();
  const displayName = firstName?.trim() || t('user_report_fallback_name');

  return (
    <Box direction="row" align="start" justify="between" gap="md">
      <Text size="xs" weight="semibold" className="tracking-widest text-black">
        {t('user_report_brand_line')}
      </Text>
      <Box align="end" gap="xs">
        <Text size="xs" weight="semibold" className="text-black">
          {t('user_report_your_view')}
        </Text>
        <Text size="2xs" className="text-black/70">
          {t('user_report_tracked_meta', {
            name: displayName,
            days: trackedDays,
          })}
        </Text>
      </Box>
    </Box>
  );
};
