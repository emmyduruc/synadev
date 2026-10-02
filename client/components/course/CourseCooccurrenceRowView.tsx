import { View } from 'react-native';

import { CourseCooccurrenceTile } from '@/components/course/CourseCooccurrenceTile';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import {
  COURSE_COOCCURRENCE_WEEK_SIZE,
  type CourseCooccurrenceRow,
  type CourseCooccurrenceTile as CourseCooccurrenceTileModel,
} from '@/lib/course/courseCooccurrence';
import { semanticColors } from '@/lib/ui';

export type CourseCooccurrenceRowViewProps = {
  row: CourseCooccurrenceRow;
  isSelected?: boolean;
  highlightedDateKeys?: ReadonlySet<string>;
  onPressRow: (row: CourseCooccurrenceRow) => void;
  onPressTile?: (row: CourseCooccurrenceRow, tile: CourseCooccurrenceTileModel) => void;
};

const chunkTiles = (tiles: readonly CourseCooccurrenceTileModel[]) => {
  const weeks: CourseCooccurrenceTileModel[][] = [];

  for (let index = 0; index < tiles.length; index += COURSE_COOCCURRENCE_WEEK_SIZE) {
    weeks.push([...tiles.slice(index, index + COURSE_COOCCURRENCE_WEEK_SIZE)]);
  }

  return weeks;
};

export const CourseCooccurrenceRowView = ({
  row,
  isSelected = false,
  highlightedDateKeys,
  onPressRow,
  onPressTile,
}: CourseCooccurrenceRowViewProps) => {
  const { t } = useTranslate();
  const weeks = chunkTiles(row.tiles);

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={t(row.labelKey)}
      accessibilityState={{ selected: isSelected }}
      onPress={() => onPressRow(row)}
      className="py-1">
      <Box direction="row" align="center" gap="sm" className="relative">
        <View
          pointerEvents="none"
          className="absolute left-0 z-10 h-8 w-[3px] rounded-full"
          style={{
            top: 4,
            backgroundColor: isSelected ? semanticColors.foreground : 'transparent',
          }}
        />

        <Box className="w-[88px]">
          <Text
            size="2xs"
            weight={isSelected ? 'bold' : 'medium'}
            color="foreground"
            align="right"
            responsive={false}
            numberOfLines={2}
            className="leading-tight">
            {t(row.labelKey)}
          </Text>
        </Box>

        <Box direction="row" align="center" className="min-w-0 flex-1" gap="sm">
          {weeks.map((weekTiles, weekIndex) => (
            <Box key={`${row.id}-week-${weekIndex}`} direction="row" className="gap-[2px]">
              {weekTiles.map((tile) => {
                const isHighlighted = highlightedDateKeys?.has(tile.dateKey) ?? false;

                return (
                  <TouchableOpacity
                    key={`${row.id}-${tile.dateKey}`}
                    accessibilityRole="button"
                    hitSlop={{ top: 4, bottom: 4, left: 2, right: 2 }}
                    onPress={() => {
                      if (onPressTile) {
                        onPressTile(row, tile);
                        return;
                      }

                      onPressRow(row);
                    }}
                    className="rounded-sm"
                    style={
                      isHighlighted
                        ? { backgroundColor: semanticColors.report.dataBackground }
                        : undefined
                    }>
                    <CourseCooccurrenceTile kind={tile.kind} />
                  </TouchableOpacity>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>
    </TouchableOpacity>
  );
};
