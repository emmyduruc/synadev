import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import { useTranslate } from "@/hooks/useTranslate";

export type ReportCoverageCardProps = {
  documentedDays: number;
  windowDays: number;
  emptyDays: number;
  symptomFreeDays: number;
  backfilledCount: number;
  backfilledAfterOneDay: number;
  backfilledAfterFourDays: number;
};

export const ReportCoverageCard = ({
  documentedDays,
  windowDays,
  emptyDays,
  symptomFreeDays,
  backfilledCount,
  backfilledAfterOneDay,
  backfilledAfterFourDays,
}: ReportCoverageCardProps) => {
  const { t } = useTranslate();
  const showBackfilled = backfilledCount > 0;

  return (
    <Box
      className="rounded-2xl border border-border bg-card px-4 py-4"
      gap="sm"
    >
      <Text size="base" weight="bold" className="leading-tight" family="serif">
        {t("report_coverage_heading")}
      </Text>

      <Box gap="xs">
        <Text size="sm" color="foreground" className="leading-relaxed">
          {t("report_coverage_documented", {
            documented: documentedDays,
            total: windowDays,
          })}
        </Text>
        <Text size="xs" color="foreground-muted" className="leading-relaxed">
          {t("report_coverage_empty_days", { count: emptyDays })}
        </Text>
      </Box>

      <Text size="sm" color="foreground" className="leading-relaxed">
        {t("report_coverage_detail", {
          documented: documentedDays,
          symptomFree: symptomFreeDays,
        })}
      </Text>

      {showBackfilled ? (
        <Text size="2xs" color="foreground-muted" className="leading-relaxed">
          {t("report_coverage_backfilled", {
            count: backfilledCount,
            afterOne: backfilledAfterOneDay,
            afterFour: backfilledAfterFourDays,
          })}
        </Text>
      ) : null}
    </Box>
  );
};
