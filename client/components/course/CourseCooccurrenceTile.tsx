import { View } from 'react-native';

import type { CourseCooccurrenceTileKind } from '@/lib/course/courseCooccurrence';
import { semanticColors } from '@/lib/ui';

export type CourseCooccurrenceTileProps = {
  kind: CourseCooccurrenceTileKind;
};

const TILE_STYLE: Record<
  CourseCooccurrenceTileKind,
  { backgroundColor: string; borderColor: string; borderWidth: number }
> = {
  empty: {
    backgroundColor: 'transparent',
    borderColor: semanticColors.border,
    borderWidth: 1,
  },
  noted: {
    backgroundColor: semanticColors.ovum.heat2,
    borderColor: semanticColors.ovum.heat2,
    borderWidth: 0,
  },
  weaker: {
    backgroundColor: semanticColors.ovum.heatWeaker,
    borderColor: semanticColors.ovum.heatWeaker,
    borderWidth: 0,
  },
  watch: {
    backgroundColor: semanticColors.ovum.watch,
    borderColor: semanticColors.ovum.watch,
    borderWidth: 0,
  },
  watch_light: {
    backgroundColor: semanticColors.ovum.watchLight,
    borderColor: semanticColors.ovum.watchLight,
    borderWidth: 0,
  },
  bleeding: {
    backgroundColor: semanticColors.card,
    borderColor: semanticColors.report.bleeding,
    borderWidth: 1.5,
  },
};

export const CourseCooccurrenceTile = ({ kind }: CourseCooccurrenceTileProps) => {
  const style = TILE_STYLE[kind];

  return (
    <View
      className="h-5 w-[5px] rounded-full"
      style={{
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        borderWidth: style.borderWidth,
      }}
    />
  );
};
