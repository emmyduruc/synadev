import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';

export type DeepeningProgressCardProps = {
  completedCount: number;
  totalCount: number;
};

export const DeepeningProgressCard = ({
  completedCount,
  totalCount,
}: DeepeningProgressCardProps) => {
  const { t } = useTranslate();
  const ratio = totalCount === 0 ? 0 : completedCount / totalCount;

  return (
    <Box gap="sm" className="rounded-2xl border border-white/60 bg-white/90 p-5">
      <Text size="sm" weight="medium">
        {t('deepening_progress_label', {
          completed: completedCount,
          total: totalCount,
        })}
      </Text>
      <Box className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <Box
          className="h-full rounded-full bg-primary-500"
          style={{ width: `${Math.min(100, Math.max(0, ratio * 100))}%` }}
        />
      </Box>
    </Box>
  );
};
