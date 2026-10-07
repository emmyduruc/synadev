import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import { useTranslate } from "@/hooks/useTranslate";

const NUMBER_ROWS = [
  {
    valueKey: "report_numbers_deep_sleep_value",
    bodyKey: "report_numbers_deep_sleep_body",
  },
  {
    valueKey: "report_numbers_next_day_value",
    bodyKey: "report_numbers_next_day_body",
  },
  {
    valueKey: "report_numbers_waking_value",
    bodyKey: "report_numbers_waking_body",
  },
] as const;

export const ReportNumbersCard = () => {
  const { t } = useTranslate();

  return (
    <Box
      className="rounded-2xl border border-border bg-card px-4 py-4"
      gap="lg"
    >
      <Text size="base" weight="bold" family="serif" className="leading-tight">
        {t("report_numbers_heading")}
      </Text>

      <Box gap="lg">
        {NUMBER_ROWS.map((row) => (
          <Box key={row.valueKey} gap="xs">
            <Text
              size="2xl"
              weight="bold"
              family="serif"
              tabularNums
              color="foreground"
              className="leading-tight"
            >
              {t(row.valueKey)}
            </Text>
            <Text
              size="sm"
              color="foreground-muted"
              className="leading-relaxed"
            >
              {t(row.bodyKey)}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
