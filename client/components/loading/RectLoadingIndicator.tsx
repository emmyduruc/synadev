import { RectLoadingBar } from '@/components/loading/RectLoadingBar';
import { Box } from '@/components/ui/Box';
import { cn } from '@/lib/ui';

const RECT_INDEXES = [0, 1, 2, 3, 4] as const;

export type RectLoadingIndicatorProps = {
  className?: string;
};

/** Soft rectangle wave used in place of the mascot loading bear. */
export const RectLoadingIndicator = ({ className }: RectLoadingIndicatorProps) => (
  <Box direction="row" align="center" justify="center" className={cn('gap-2', className)}>
    {RECT_INDEXES.map((index) => (
      <RectLoadingBar key={index} index={index} />
    ))}
  </Box>
);
