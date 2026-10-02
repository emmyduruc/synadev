import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';

export type CoursePeriodHeaderProps = {
  windowDays: number;
  documentedDays: number;
  emptyDays: number;
};

export const CoursePeriodHeader = ({
  windowDays,
  documentedDays,
  emptyDays,
}: CoursePeriodHeaderProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="xs">
      <Text size="2xl" weight="bold" className="leading-tight">
        {t('course_period_title', { days: windowDays })}
      </Text>
      <Text size="sm" color="foreground-muted" className="leading-relaxed">
        {t('course_period_subtitle', {
          documented: documentedDays,
          total: windowDays,
          empty: emptyDays,
        })}
      </Text>
    </Box>
  );
};
