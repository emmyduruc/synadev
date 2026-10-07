import { SymptomEntryNoticeBox } from "@/components/symptoms/entry/SymptomEntryNoticeBox";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import { TouchableOpacity } from "@/components/ui/TouchableOpacity";
import { useTranslate } from "@/hooks/useTranslate";
import { cn } from "@/lib/ui";

export type SymptomEntryPeriodTabProps = {
  isBleeding: boolean;
  isSaving: boolean;
  onChangeBleeding: (isBleeding: boolean) => void;
};

export const SymptomEntryPeriodTab = ({
  isBleeding,
  isSaving,
  onChangeBleeding,
}: SymptomEntryPeriodTabProps) => {
  const { t } = useTranslate();

  const renderChoice = (value: boolean, labelKey: string) => {
    const isSelected = isBleeding === value;

    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected, disabled: isSaving }}
        disabled={isSaving}
        onPress={() => onChangeBleeding(value)}
        className={cn(
          "flex-1 items-center justify-center rounded-2xl border px-3 py-3.5",
          isSelected
            ? "border-primary-500 bg-primary-500"
            : "border-border bg-card",
        )}
      >
        <Text
          size="sm"
          weight="medium"
          color={isSelected ? "white" : "foreground"}
          responsive={false}
          className="text-center"
        >
          {t(labelKey)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Box gap="md">
      <Box
        className="rounded-2xl border border-border bg-card px-4 py-4"
        gap="md"
      >
        <Text size="base" weight="bold" family="serif">
          {t("symptom_entry_period_bleeding_title")}
        </Text>

        <Box direction="row" gap="sm">
          {renderChoice(true, "symptom_entry_period_bleeding_yes")}
          {renderChoice(false, "symptom_entry_period_bleeding_no")}
        </Box>

        <Text size="xs" color="foreground-muted" className="leading-relaxed">
          {t("symptom_entry_period_bleeding_hint")}
        </Text>
      </Box>

      <SymptomEntryNoticeBox />
    </Box>
  );
};
