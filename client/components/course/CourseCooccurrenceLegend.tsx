import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import type { CourseCooccurrenceTileKind } from '@/lib/course/courseCooccurrence';
import { semanticColors } from '@/lib/ui';

type LegendItem = {
  kind: Exclude<CourseCooccurrenceTileKind, 'watch_light'>;
  labelKey: string;
};

const LEGEND_ITEMS: readonly LegendItem[] = [
  { kind: 'noted', labelKey: 'course_cooccurrence_legend_noted' },
  { kind: 'weaker', labelKey: 'course_cooccurrence_legend_weaker' },
  { kind: 'watch', labelKey: 'course_cooccurrence_legend_watch' },
  { kind: 'bleeding', labelKey: 'course_cooccurrence_legend_bleeding' },
  { kind: 'empty', labelKey: 'course_cooccurrence_legend_empty' },
];

const SWATCH_STYLE: Record<
  LegendItem['kind'],
  { backgroundColor: string; borderColor: string; borderWidth: number }
> = {
  empty: {
    backgroundColor: semanticColors.card,
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
  bleeding: {
    backgroundColor: semanticColors.card,
    borderColor: semanticColors.report.bleeding,
    borderWidth: 1.5,
  },
};

export const CourseCooccurrenceLegend = () => {
  const { t } = useTranslate();

  return (
    <Box direction="row" className="flex-wrap gap-x-4 gap-y-2">
      {LEGEND_ITEMS.map((item) => {
        const swatch = SWATCH_STYLE[item.kind];

        return (
          <Box key={item.kind} direction="row" align="center" gap="xs">
            <Box
              className="h-3 w-3 rounded-sm"
              style={{
                backgroundColor: swatch.backgroundColor,
                borderColor: swatch.borderColor,
                borderWidth: swatch.borderWidth,
              }}
            />
            <Text size="2xs" color="foreground-muted" responsive={false}>
              {t(item.labelKey)}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
};
