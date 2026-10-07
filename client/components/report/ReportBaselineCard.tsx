import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import { useTranslate } from "@/hooks/useTranslate";

export const ReportBaselineCard = () => {
  const { t } = useTranslate();

  return (
    <Box
      className="rounded-2xl border border-border bg-card px-4 py-4"
      gap="sm"
    >
      <Text size="base" weight="bold" className="leading-tight" family="serif">
        {t("report_baseline_heading")}
      </Text>
      <Text size="sm" color="foreground" className="leading-relaxed">
        {t("report_baseline_body")}
      </Text>
      <Text size="xs" color="foreground-muted" className="leading-relaxed">
        {t("report_baseline_footer")}
      </Text>
    </Box>
  );
};
