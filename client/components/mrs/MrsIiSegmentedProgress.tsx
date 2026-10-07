import { Box } from '@/components/ui/Box';
import { cn } from '@/lib/ui';

export type MrsIiSegmentedProgressProps = {
  total: number;
  /** 1-based current question number. */
  current: number;
};

export const MrsIiSegmentedProgress = ({
  total,
  current,
}: MrsIiSegmentedProgressProps) => (
  <Box direction="row" gap="xs" className="w-full">
    {Array.from({ length: total }, (_, index) => {
      const isFilled = index < current;

      return (
        <Box
          key={`mrs-progress-${index}`}
          flex={1}
          className={cn(
            'h-1.5 rounded-full',
            isFilled ? 'bg-primary-500' : 'bg-border',
          )}
        />
      );
    })}
  </Box>
);
