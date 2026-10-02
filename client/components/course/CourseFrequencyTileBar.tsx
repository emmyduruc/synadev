import { View } from 'react-native';

import { Box } from '@/components/ui/Box';
import { COURSE_FREQUENCY_TILE_COUNT } from '@/lib/course/courseFrequencies';
import { semanticColors } from '@/lib/ui';

export type CourseFrequencyTileBarProps = {
  filledTiles: number;
};

export const CourseFrequencyTileBar = ({ filledTiles }: CourseFrequencyTileBarProps) => {
  const clampedFilled = Math.min(
    COURSE_FREQUENCY_TILE_COUNT,
    Math.max(0, filledTiles),
  );

  return (
    <Box direction="row" className="gap-1">
      {Array.from({ length: COURSE_FREQUENCY_TILE_COUNT }, (_, index) => {
        const isFilled = index < clampedFilled;

        return (
          <View
            key={`tile-${index}`}
            className="h-2.5 flex-1 rounded-sm"
            style={{
              backgroundColor: isFilled ? semanticColors.ovum.heat2 : 'transparent',
              borderWidth: isFilled ? 0 : 1,
              borderColor: semanticColors.border,
            }}
          />
        );
      })}
    </Box>
  );
};
