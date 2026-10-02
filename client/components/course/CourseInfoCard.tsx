import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';

export type CourseInfoCardProps = {
  titleKey: string;
  bodyKey: string;
};

export const CourseInfoCard = ({ titleKey, bodyKey }: CourseInfoCardProps) => {
  const { t } = useTranslate();

  return (
    <Box className="rounded-2xl border border-border bg-card px-4 py-4" gap="sm">
      <Text size="base" weight="bold" className="leading-tight">
        {t(titleKey)}
      </Text>
      <Text size="sm" color="foreground-muted" className="leading-relaxed">
        {t(bodyKey)}
      </Text>
    </Box>
  );
};
