import { CourseCooccurrenceLegend } from "@/components/course/CourseCooccurrenceLegend";
import { CourseCooccurrenceRowView } from "@/components/course/CourseCooccurrenceRowView";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import { useTranslate } from "@/hooks/useTranslate";
import type {
  CourseCooccurrenceRow,
  CourseCooccurrenceRowId,
  CourseCooccurrenceSummary,
  CourseCooccurrenceTile,
} from "@/lib/course/courseCooccurrence";

export type CourseCooccurrenceCardProps = {
  summary: CourseCooccurrenceSummary;
  selectedRowId?: CourseCooccurrenceRowId | null;
  highlightedDateKeys?: ReadonlySet<string>;
  onPressRow?: (row: CourseCooccurrenceRow) => void;
  onPressTile?: (
    row: CourseCooccurrenceRow,
    tile: CourseCooccurrenceTile,
  ) => void;
};

export const CourseCooccurrenceCard = ({
  summary,
  selectedRowId = null,
  highlightedDateKeys,
  onPressRow,
  onPressTile,
}: CourseCooccurrenceCardProps) => {
  const { t } = useTranslate();

  return (
    <Box
      className="rounded-2xl border border-border bg-card px-4 py-4"
      gap="md"
    >
      <Box gap="xs">
        <Text
          size="base"
          weight="bold"
          className="leading-tight"
          family="serif"
        >
          {t("course_cooccurrence_heading")}
        </Text>
        <Text size="xs" color="foreground-muted">
          {t("course_cooccurrence_subtitle", { days: summary.windowDays })}
        </Text>
      </Box>

      <Box gap="sm">
        {summary.rows.map((row) => (
          <CourseCooccurrenceRowView
            key={row.id}
            row={row}
            isSelected={selectedRowId === row.id}
            highlightedDateKeys={highlightedDateKeys}
            onPressRow={onPressRow ?? (() => undefined)}
            onPressTile={onPressTile}
          />
        ))}
      </Box>

      <CourseCooccurrenceLegend />

      <Text size="2xs" color="foreground-muted" className="leading-relaxed">
        {t("course_cooccurrence_footer")}
      </Text>
    </Box>
  );
};
