import { Box } from '@/components/ui/Box';

export type InsightStoryProgressBarProps = {
  slideCount: number;
  activeIndex: number;
};

export const InsightStoryProgressBar = ({
  slideCount,
  activeIndex,
}: InsightStoryProgressBarProps) => (
  <Box direction="row" gap="xs" className="w-full">
    {Array.from({ length: slideCount }, (_, index) => {
      const isComplete = index < activeIndex;
      const isActive = index === activeIndex;

      return (
        <Box key={`story-progress-${index}`} flex={1} className="h-0.5 overflow-hidden rounded-full bg-white/30">
          <Box
            className="h-full rounded-full bg-white"
            style={{ width: isComplete || isActive ? '100%' : '0%' }}
          />
        </Box>
      );
    })}
  </Box>
);
