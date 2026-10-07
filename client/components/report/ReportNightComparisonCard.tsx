import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import { useTranslate } from "@/hooks/useTranslate";

export const ReportNightComparisonCard = () => {
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
          {t("report_night_comparison_heading")}
        </Text>
        <Text size="sm" color="foreground-muted" className="leading-relaxed">
          {t("report_night_comparison_episodes_meta")}
        </Text>
        <Text size="sm" color="foreground-muted" className="leading-relaxed">
          {t("report_night_comparison_quiet_meta")}
        </Text>
      </Box>

      <Box direction="row" gap="sm">
        <Box
          className="min-w-0 flex-1 rounded-2xl bg-primary-50 px-3 py-3"
          gap="xs"
        >
          <Text size="xs" color="foreground-muted" className="leading-tight">
            {t("report_night_comparison_episodes_label")}
          </Text>
          <Text
            size="lg"
            weight="bold"
            family="serif"
            tabularNums
            color="foreground"
            className="leading-tight"
          >
            {t("report_night_comparison_episodes_duration")}
          </Text>
          <Text
            size="2xs"
            color="foreground-subtle"
            className="leading-relaxed"
          >
            {t("report_night_comparison_episodes_hr")}
          </Text>
        </Box>

        <Box
          className="min-w-0 flex-1 rounded-2xl bg-primary-50 px-3 py-3"
          gap="xs"
        >
          <Text size="xs" color="foreground-muted" className="leading-tight">
            {t("report_night_comparison_quiet_label")}
          </Text>
          <Text
            size="lg"
            weight="bold"
            family="serif"
            tabularNums
            color="foreground"
            className="leading-tight"
          >
            {t("report_night_comparison_quiet_duration")}
          </Text>
          <Text
            size="2xs"
            color="foreground-subtle"
            className="leading-relaxed"
          >
            {t("report_night_comparison_quiet_hr")}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
