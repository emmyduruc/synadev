import { useMemo } from "react";

import { Accordion, type AccordionItemModel } from "@/components/ui/Accordion";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import { useTranslate } from "@/hooks/useTranslate";

const TOGETHER_ITEM_IDS = {
  hotFlashes: "hot_flashes",
  sameNights: "same_nights",
  nextDay: "next_day",
} as const;

export const ReportTogetherCard = () => {
  const { t } = useTranslate();

  const items = useMemo<readonly AccordionItemModel[]>(
    () => [
      {
        id: TOGETHER_ITEM_IDS.hotFlashes,
        title: t("report_together_item_hot_flashes"),
        content: t("report_together_item_hot_flashes_body"),
      },
      {
        id: TOGETHER_ITEM_IDS.sameNights,
        title: t("report_together_item_same_nights"),
        content: t("report_together_item_same_nights_body"),
      },
      {
        id: TOGETHER_ITEM_IDS.nextDay,
        title: t("report_together_item_next_day"),
        content: t("report_together_item_next_day_body"),
      },
    ],
    [t],
  );

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
          {t("report_together_heading")}
        </Text>
        <Text size="sm" color="foreground-muted" className="leading-relaxed">
          {t("report_together_subtitle")}
        </Text>
      </Box>

      <Accordion
        items={items}
        defaultExpandedId={TOGETHER_ITEM_IDS.hotFlashes}
      />
    </Box>
  );
};
